import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { HomestayEntity } from './homestay.entity';
import {
  HomestayPricingAdjustmentType,
  HomestayPricingRuleEntity,
  HomestayPricingRuleStatus,
} from './homestay-pricing-rule.entity';
import { HomestayPricingQuoteDto } from './dto/homestay-pricing-quote.dto';

interface RateComputationOptions {
  homestay: HomestayEntity;
  rules: HomestayPricingRuleEntity[];
  stayLength: number;
  guests: number;
}

@Injectable()
export class HomestayPricingService {
  constructor(
    @InjectRepository(HomestayEntity)
    private readonly homestayRepository: Repository<HomestayEntity>,
    @InjectRepository(HomestayPricingRuleEntity)
    private readonly pricingRuleRepository: Repository<HomestayPricingRuleEntity>,
  ) {}

  async quote(
    homestayId: string,
    dto: HomestayPricingQuoteDto,
  ): Promise<{
    currency: string;
    totals: {
      nights: number;
      subtotal: number;
      averageNightlyRate: number;
      minNightlyRate: number;
      maxNightlyRate: number;
      extrasTotal: number;
      grandTotal: number;
    };
    nights: {
      date: string;
      baseRate: number;
      finalRate: number;
      appliedRule: {
        id: string;
        name: string;
        type: string;
        priority: number;
      } | null;
    }[];
  }> {
    const { checkInDate, checkOutDate } = dto;
    const start = this.coerceDate(checkInDate, 'checkInDate');
    const end = this.coerceDate(checkOutDate, 'checkOutDate');

    if (end <= start) {
      throw new BadRequestException('checkOutDate must be after checkInDate');
    }

    const homestay = await this.homestayRepository.findOne({
      where: { id: homestayId },
    });
    if (!homestay) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    if (homestay.basePrice === null || homestay.basePrice === undefined) {
      throw new BadRequestException(
        'Homestay does not have a base price configured',
      );
    }

    const stayLength = this.getNightsBetween(start, end);
    const guestCount = (dto.adults ?? 0) + (dto.children ?? 0);
    const effectiveGuests = guestCount > 0 ? guestCount : homestay.maxGuests ?? 1;

    const rules = await this.pricingRuleRepository.find({
      where: {
        homestay: { id: homestayId },
        status: HomestayPricingRuleStatus.ACTIVE,
        startDate: LessThanOrEqual(end),
        endDate: MoreThanOrEqual(start),
      },
    });

    const sortedRules = this.prepareRules(rules);

    const options: RateComputationOptions = {
      homestay,
      rules: sortedRules,
      stayLength,
      guests: effectiveGuests,
    };

    const nightlyBreakdown = this.calculateNightlyRates(start, end, options);

    const nightlyTotals = nightlyBreakdown.reduce(
      (acc, night) => {
        acc.subtotal += night.finalRate;
        acc.minNightlyRate = Math.min(acc.minNightlyRate, night.finalRate);
        acc.maxNightlyRate = Math.max(acc.maxNightlyRate, night.finalRate);
        return acc;
      },
      {
        nights: nightlyBreakdown.length,
        subtotal: 0,
        averageNightlyRate: 0,
        minNightlyRate: Number.POSITIVE_INFINITY,
        maxNightlyRate: 0,
      },
    );

    nightlyTotals.averageNightlyRate =
      nightlyTotals.nights > 0
        ? nightlyTotals.subtotal / nightlyTotals.nights
        : 0;
    if (!Number.isFinite(nightlyTotals.minNightlyRate)) {
      nightlyTotals.minNightlyRate = 0;
    }

    const extrasTotal = Number(dto.extraFeesTotal ?? 0);
    const grandTotal = nightlyTotals.subtotal + extrasTotal;

    return {
      currency: homestay.currency ?? 'VND',
      totals: {
        ...nightlyTotals,
        extrasTotal,
        grandTotal,
      },
      nights: nightlyBreakdown,
    };
  }

  calculateRateForDate(
    date: Date,
    options: RateComputationOptions,
  ): {
    baseRate: number;
    finalRate: number;
    appliedRule: HomestayPricingRuleEntity | null;
  } {
    const baseRate = Number(options.homestay.basePrice ?? 0);
    if (!options.rules.length) {
      return {
        baseRate,
        finalRate: baseRate,
        appliedRule: null,
      };
    }

    const applicableRule = this.findApplicableRule(
      date,
      options.rules,
      options.stayLength,
      options.guests,
    );

    if (!applicableRule) {
      return {
        baseRate,
        finalRate: baseRate,
        appliedRule: null,
      };
    }

    const finalRate = this.applyRule(baseRate, applicableRule);

    return {
      baseRate,
      finalRate,
      appliedRule: applicableRule,
    };
  }

  private calculateNightlyRates(
    start: Date,
    end: Date,
    options: RateComputationOptions,
  ) {
    const nights: {
      date: string;
      baseRate: number;
      finalRate: number;
      appliedRule: {
        id: string;
        name: string;
        type: string;
        priority: number;
      } | null;
    }[] = [];

    const cursor = new Date(start);
    while (cursor < end) {
      const rate = this.calculateRateForDate(cursor, options);
      nights.push({
        date: cursor.toISOString(),
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
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return nights;
  }

  prepareRules(rules: HomestayPricingRuleEntity[]) {
    return this.sortRules(rules);
  }

  private sortRules(rules: HomestayPricingRuleEntity[]) {
    return [...rules].sort((a, b) => {
      if (a.priority === b.priority) {
        return a.startDate.getTime() - b.startDate.getTime();
      }
      return b.priority - a.priority;
    });
  }

  private findApplicableRule(
    date: Date,
    rules: HomestayPricingRuleEntity[],
    stayLength: number,
    guests: number,
  ): HomestayPricingRuleEntity | null {
    for (const rule of rules) {
      const startsBefore = rule.startDate <= date;
      const endsAfter =
        !rule.endDate || rule.endDate.getTime() >= date.getTime();
      if (!startsBefore || !endsAfter) {
        continue;
      }

      if (rule.daysOfWeek?.length) {
        const day = date.getUTCDay();
        if (!rule.daysOfWeek.includes(day)) {
          continue;
        }
      }

      if (rule.minimumNights && stayLength < rule.minimumNights) {
        continue;
      }
      if (rule.maximumNights && stayLength > rule.maximumNights) {
        continue;
      }

      if (rule.minimumGuests && guests < rule.minimumGuests) {
        continue;
      }
      if (rule.maximumGuests && guests > rule.maximumGuests) {
        continue;
      }

      return rule;
    }
    return null;
  }

  private applyRule(baseRate: number, rule: HomestayPricingRuleEntity): number {
    if (rule.newBasePrice !== null && rule.newBasePrice !== undefined) {
      return Math.max(0, Number(rule.newBasePrice));
    }

    const adjustment = Number(rule.priceAdjustmentValue ?? 0);

    if (rule.priceAdjustmentType === HomestayPricingAdjustmentType.FIXED) {
      return Math.max(0, baseRate + adjustment);
    }

    const multiplier = adjustment / 100;
    const adjusted = baseRate + baseRate * multiplier;
    return Math.max(0, adjusted);
  }

  private coerceDate(value: string | Date, field: string): Date {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid ${field}`);
    }
    return date;
  }

  private getNightsBetween(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }
}
