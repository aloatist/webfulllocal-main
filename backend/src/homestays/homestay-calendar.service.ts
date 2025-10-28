import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomestayEntity } from './homestay.entity';
import { HomestayAvailabilityEntity } from './homestay-availability.entity';
import {
  HomestayBookingEntity,
  HomestayBookingStatus,
} from './homestay-booking.entity';
import {
  HomestayPricingRuleEntity,
  HomestayPricingRuleStatus,
} from './homestay-pricing-rule.entity';
import { HomestayCalendarQueryDto } from './dto/homestay-calendar-query.dto';
import { HomestayPricingService } from './homestay-pricing.service';

export interface HomestayCalendarDay {
  date: string;
  availability: {
    status: string;
    availableUnits: number;
    bookedUnits: number;
  } | null;
  bookings: {
    id: string;
    status: HomestayBookingStatus;
    reference: string;
    checkInDate: string;
    checkOutDate: string;
    guestName: string | null;
  }[];
  pricing: {
    baseRate: number;
    finalRate: number;
    appliedRule: {
      id: string;
      name: string;
      type: string;
      priority: number;
    } | null;
  } | null;
}

export interface HomestayCalendarSummary {
  availableDays: number;
  blockedDays: number;
  fullyBookedDays: number;
  occupancyRate: number;
}

export interface HomestayCalendarResponse {
  homestay: {
    id: string;
    title: string;
    slug: string;
    basePrice: number | null;
    currency: string;
  };
  range: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  days: HomestayCalendarDay[];
  summary: HomestayCalendarSummary;
}

@Injectable()
export class HomestayCalendarService {
  constructor(
    @InjectRepository(HomestayEntity)
    private readonly homestayRepository: Repository<HomestayEntity>,
    @InjectRepository(HomestayAvailabilityEntity)
    private readonly availabilityRepository: Repository<HomestayAvailabilityEntity>,
    @InjectRepository(HomestayBookingEntity)
    private readonly bookingRepository: Repository<HomestayBookingEntity>,
    @InjectRepository(HomestayPricingRuleEntity)
    private readonly pricingRuleRepository: Repository<HomestayPricingRuleEntity>,
    private readonly pricingService: HomestayPricingService,
  ) {}

  async getCalendar(
    homestayId: string,
    query: HomestayCalendarQueryDto,
  ): Promise<HomestayCalendarResponse> {
    const start = this.resolveStartDate(query.startDate);
    const end = this.resolveEndDate(start, query.endDate, query.window);

    if (end <= start) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const homestay = await this.homestayRepository.findOne({
      where: { id: homestayId },
      select: ['id', 'name', 'slug', 'basePrice', 'currency', 'maxGuests'],
    });
    if (!homestay) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    const [availabilities, bookings, pricingRules] = await Promise.all([
      this.loadAvailabilities(homestayId, start, end),
      query.includeBookings === false
        ? []
        : this.loadBookings(homestayId, start, end),
      query.includePricing === false
        ? []
        : this.loadPricingRules(homestayId, start, end),
    ]);

    const days = this.buildDays(
      homestay,
      start,
      end,
      availabilities,
      bookings,
      pricingRules,
      query,
    );

    const summary = this.computeSummary(days);

    return {
      homestay: {
        id: homestay.id,
        title: homestay.name,
        slug: homestay.slug,
        basePrice:
          homestay.basePrice === null || homestay.basePrice === undefined
            ? null
            : Number(homestay.basePrice),
        currency: homestay.currency ?? 'VND',
      },
      range: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalDays: days.length,
      },
      days,
      summary,
    };
  }

  private buildDays(
    homestay: HomestayEntity,
    start: Date,
    end: Date,
    availabilities: HomestayAvailabilityEntity[],
    bookings: HomestayBookingEntity[],
    pricingRules: HomestayPricingRuleEntity[],
    query: HomestayCalendarQueryDto,
  ): HomestayCalendarDay[] {
    const includeAvailability =
      query.includeAvailability === undefined || query.includeAvailability;
    const includePricing = query.includePricing === undefined || query.includePricing;
    const includeBookings =
      query.includeBookings === undefined || query.includeBookings;

    const days: HomestayCalendarDay[] = [];

    const rateOptions = includePricing
      ? {
          homestay,
          rules: this.pricingService.prepareRules(pricingRules),
          stayLength: 1,
          guests: homestay.maxGuests ?? 1,
        }
      : null;

    const cursor = new Date(start);
    while (cursor <= end) {
      const availability = includeAvailability
        ? this.findAvailabilityForDate(cursor, availabilities)
        : null;

      const dayBookings = includeBookings
        ? this.findBookingsForDate(cursor, bookings)
        : [];

      let pricing: HomestayCalendarDay['pricing'] = null;
      if (includePricing && rateOptions) {
        const rate = this.pricingService.calculateRateForDate(cursor, {
          ...rateOptions,
          stayLength: 1,
        });
        pricing = {
          baseRate: rate.baseRate,
          finalRate: rate.finalRate,
          appliedRule: rate.appliedRule
            ? {
                id: rate.appliedRule.id,
                name: rate.appliedRule.name,
                type: rate.appliedRule.type,
                priority: rate.appliedRule.priority,
              }
            : null,
        };
      }

      days.push({
        date: cursor.toISOString(),
        availability: availability
          ? {
              status: availability.status,
              availableUnits: availability.availableUnits,
              bookedUnits: availability.bookedUnits,
            }
          : null,
        bookings: dayBookings.map((booking) => ({
          id: booking.id,
          status: booking.status,
          reference: booking.reference,
          checkInDate: booking.checkInDate.toISOString(),
          checkOutDate: booking.checkOutDate.toISOString(),
          guestName: booking.guestName ?? null,
        })),
        pricing,
      });

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return days;
  }

  private computeSummary(days: HomestayCalendarDay[]): HomestayCalendarSummary {
    let availableDays = 0;
    let blockedDays = 0;
    let fullyBookedDays = 0;

    days.forEach((day) => {
      if (!day.availability) {
        availableDays += 1;
        return;
      }

      if (day.availability.status !== 'available') {
        blockedDays += 1;
        return;
      }

      const remainingUnits =
        day.availability.availableUnits - day.availability.bookedUnits;
      if (remainingUnits <= 0) {
        fullyBookedDays += 1;
      } else {
        availableDays += 1;
      }
    });

    const occupancyRate =
      days.length > 0 ? fullyBookedDays / days.length : 0;

    return {
      availableDays,
      blockedDays,
      fullyBookedDays,
      occupancyRate,
    };
  }

  private findAvailabilityForDate(
    date: Date,
    availabilities: HomestayAvailabilityEntity[],
  ) {
    return availabilities.find((availability) => {
      const start = new Date(availability.startDate);
      const end = availability.endDate ? new Date(availability.endDate) : null;
      const isAfterStart = start <= date;
      const isBeforeEnd = !end || end >= date;
      return isAfterStart && isBeforeEnd;
    });
  }

  private findBookingsForDate(
    date: Date,
    bookings: HomestayBookingEntity[],
  ) {
    return bookings.filter((booking) => {
      const checkIn = booking.checkInDate;
      const checkOut = booking.checkOutDate;
      return checkIn <= date && checkOut > date;
    });
  }

  private async loadAvailabilities(
    homestayId: string,
    start: Date,
    end: Date,
  ) {
    return this.availabilityRepository
      .createQueryBuilder('availability')
      .leftJoinAndSelect('availability.room', 'room')
      .where('availability.homestayId = :homestayId', { homestayId })
      .andWhere('availability.startDate <= :end', { end })
      .andWhere(
        '(availability.endDate IS NULL OR availability.endDate >= :start)',
        { start },
      )
      .getMany();
  }

  private async loadBookings(
    homestayId: string,
    start: Date,
    end: Date,
  ) {
    const statusFilter = [
      HomestayBookingStatus.PENDING,
      HomestayBookingStatus.CONFIRMED,
      HomestayBookingStatus.CHECKED_IN,
      HomestayBookingStatus.COMPLETED,
    ];

    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.room', 'room')
      .where('booking.homestayId = :homestayId', { homestayId })
      .andWhere('booking.status IN (:...statuses)', { statuses: statusFilter })
      .andWhere('booking.checkInDate <= :end', { end })
      .andWhere('booking.checkOutDate >= :start', { start })
      .getMany();
  }

  private async loadPricingRules(
    homestayId: string,
    start: Date,
    end: Date,
  ) {
    return this.pricingRuleRepository
      .createQueryBuilder('rule')
      .where('rule.homestayId = :homestayId', { homestayId })
      .andWhere('rule.status = :status', {
        status: HomestayPricingRuleStatus.ACTIVE,
      })
      .andWhere('rule.startDate <= :end', { end })
      .andWhere('rule.endDate >= :start', { start })
      .getMany();
  }

  private resolveStartDate(start?: string) {
    if (!start) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return today;
    }
    const date = new Date(start);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid startDate');
    }
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  private resolveEndDate(start: Date, end?: string, window?: number) {
    if (end) {
      const date = new Date(end);
      if (Number.isNaN(date.getTime())) {
        throw new BadRequestException('Invalid endDate');
      }
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }

    const days = window ?? 30;
    const clone = new Date(start);
    clone.setUTCDate(clone.getUTCDate() + (days - 1));
    return clone;
  }
}
