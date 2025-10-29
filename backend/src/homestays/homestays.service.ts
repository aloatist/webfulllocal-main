import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  ILike,
  In,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { HomestayEntity, HomestayStatus } from './homestay.entity';
import { HomestayRoomEntity } from './homestay-room.entity';
import {
  HomestayAvailabilityEntity,
  HomestayAvailabilityStatus,
} from './homestay-availability.entity';
import { HomestayPricingRuleEntity } from './homestay-pricing-rule.entity';
import {
  HomestayBookingEntity,
  HomestayBookingStatus,
} from './homestay-booking.entity';
import { HomestayReviewEntity } from './homestay-review.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { TagEntity } from '../tags/tag.entity';
import { UserEntity } from '../users/user.entity';
import { HomestayQueryDto } from './dto/homestay-query.dto';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { CreateHomestayRoomDto } from './dto/create-homestay-room.dto';
import { UpdateHomestayRoomDto } from './dto/update-homestay-room.dto';
import { CreateHomestayAvailabilityDto } from './dto/create-homestay-availability.dto';
import { UpdateHomestayAvailabilityDto } from './dto/update-homestay-availability.dto';
import { CreateHomestayPricingRuleDto } from './dto/create-homestay-pricing-rule.dto';
import { UpdateHomestayPricingRuleDto } from './dto/update-homestay-pricing-rule.dto';

const MAX_EXPORT_LIMIT = 5000;

export interface HomestayDashboardMetrics {
  totalHomestays: number;
  publishedHomestays: number;
  draftHomestays: number;
  archivedHomestays: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export interface HomestayAnalytics {
  totals: {
    homestays: number;
    bookings: number;
    reviews: number;
  };
  statusBreakdown: Record<HomestayStatus, number>;
  featureFlags: {
    featured: number;
    verified: number;
    instantBook: number;
    superhost: number;
  };
  pricing: {
    averageBasePrice: number | null;
    minBasePrice: number | null;
    maxBasePrice: number | null;
  };
  topDestinations: {
    destinationId: string;
    name: string;
    slug: string | null;
    homestayCount: number;
  }[];
  bookingTrends: {
    month: string;
    bookings: number;
  }[];
}

@Injectable()
export class HomestaysService {
  constructor(
    @InjectRepository(HomestayEntity)
    private readonly homestayRepository: Repository<HomestayEntity>,
    @InjectRepository(HomestayRoomEntity)
    private readonly roomRepository: Repository<HomestayRoomEntity>,
    @InjectRepository(HomestayAvailabilityEntity)
    private readonly availabilityRepository: Repository<HomestayAvailabilityEntity>,
    @InjectRepository(HomestayPricingRuleEntity)
    private readonly pricingRuleRepository: Repository<HomestayPricingRuleEntity>,
    @InjectRepository(HomestayBookingEntity)
    private readonly bookingRepository: Repository<HomestayBookingEntity>,
    @InjectRepository(HomestayReviewEntity)
    private readonly reviewRepository: Repository<HomestayReviewEntity>,
    @InjectRepository(DestinationEntity)
    private readonly destinationRepository: Repository<DestinationEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    query: HomestayQueryDto,
  ): Promise<{ data: HomestayEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      destinationId,
      status,
      type,
      category,
      city,
      country,
      minGuests,
      maxGuests,
      bedrooms,
      bathrooms,
      hasParking,
      hasWifi,
      hasKitchen,
      hasAirConditioning,
      hasPool,
      hasPetFriendly,
      isFeatured,
      isVerified,
      isInstantBook,
      isSuperhost,
      checkInDate,
      checkOutDate,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: Record<string, any> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }
    if (destinationId) {
      where.destination = { id: destinationId };
    }
    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }
    if (category) {
      where.category = category;
    }
    if (city) {
      where.city = ILike(`%${city}%`);
    }
    if (country) {
      where.country = ILike(`%${country}%`);
    }
    if (minGuests && maxGuests) {
      where.maxGuests = Between(minGuests, maxGuests);
    } else if (minGuests) {
      where.maxGuests = MoreThanOrEqual(minGuests);
    } else if (maxGuests) {
      where.maxGuests = LessThan(maxGuests + 1);
    }
    if (bedrooms !== undefined) {
      where.bedrooms = bedrooms;
    }
    if (bathrooms !== undefined) {
      where.bathrooms = bathrooms;
    }
    if (hasParking !== undefined) {
      where.hasParking = hasParking;
    }
    if (hasWifi !== undefined) {
      where.hasWifi = hasWifi;
    }
    if (hasKitchen !== undefined) {
      where.hasKitchen = hasKitchen;
    }
    if (hasAirConditioning !== undefined) {
      where.hasAirConditioning = hasAirConditioning;
    }
    if (hasPool !== undefined) {
      where.hasPool = hasPool;
    }
    if (hasPetFriendly !== undefined) {
      where.hasPetFriendly = hasPetFriendly;
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }
    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }
    if (isInstantBook !== undefined) {
      where.isInstantBook = isInstantBook;
    }
    if (isSuperhost !== undefined) {
      where.isSuperhost = isSuperhost;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = Between(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
    }

    const [data, total] = await this.homestayRepository.findAndCount({
      where,
      relations: ['destination', 'tags', 'rooms', 'host'],
      order: { [sortBy]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
    });

    let filteredData: HomestayEntity[] = data;
    if (checkInDate && checkOutDate) {
      filteredData = await this.filterByAvailability(
        data,
        checkInDate,
        checkOutDate,
      );
    }

    const effectiveTotal =
      checkInDate && checkOutDate ? filteredData.length : total;

    return { data: filteredData, total: effectiveTotal };
  }

  async findById(id: string): Promise<HomestayEntity> {
    const homestay = await this.homestayRepository.findOne({
      where: { id },
      relations: [
        'destination',
        'tags',
        'rooms',
        'host',
        'availability',
        'pricingRules',
        'reviews',
        'reviews.reviewer',
        'reviews.booking',
      ],
    });

    if (!homestay) {
      throw new NotFoundException(`Homestay ${id} not found`);
    }

    return homestay;
  }

  async findBySlug(slug: string): Promise<HomestayEntity> {
    const homestay = await this.homestayRepository.findOne({
      where: { slug },
      relations: [
        'destination',
        'tags',
        'rooms',
        'host',
        'availability',
        'pricingRules',
        'reviews',
        'reviews.reviewer',
        'reviews.booking',
      ],
    });

    if (!homestay) {
      throw new NotFoundException(`Homestay with slug ${slug} not found`);
    }

    return homestay;
  }

  async create(
    dto: CreateHomestayDto,
    hostId: string,
  ): Promise<HomestayEntity> {
    const slugExists = await this.homestayRepository.exist({
      where: { slug: dto.slug },
    });
    if (slugExists) {
      throw new BadRequestException('Slug already exists');
    }

    const host = await this.userRepository.findOne({
      where: { id: hostId },
    });
    if (!host) {
      throw new NotFoundException(`Host ${hostId} not found`);
    }

    const destination = dto.destinationId
      ? await this.destinationRepository.findOne({
          where: { id: dto.destinationId },
        })
      : null;
    if (dto.destinationId && !destination) {
      throw new NotFoundException(
        `Destination ${dto.destinationId} not found`,
      );
    }

    const tags = dto.tagIds?.length
      ? await this.tagRepository.find({ where: { id: In(dto.tagIds) } })
      : [];

    const { destinationId, tagIds, rooms, availabilityBlocks, ...rest } = dto;

    const homestay = this.homestayRepository.create({
      ...rest,
      host,
      destination: destination ?? undefined,
      tags,
    });

    const savedHomestay = await this.homestayRepository.save(homestay);

    // Create nested rooms if provided
    if (rooms && rooms.length > 0) {
      for (const roomDto of rooms) {
        await this.createRoom(savedHomestay.id, roomDto as any);
      }
    }

    // Create nested availability blocks if provided
    if (availabilityBlocks && availabilityBlocks.length > 0) {
      const bulkItems = availabilityBlocks.map((blockDto) => ({
        startDate: blockDto.startDate,
        endDate: blockDto.endDate,
        notes: blockDto.notes || '',
        status: HomestayAvailabilityStatus.BLOCKED,
        roomId: undefined, // No specific room, applies to entire homestay
      }));
      await this.createAvailabilityBulk(savedHomestay.id, bulkItems as any);
    }

    return this.findById(savedHomestay.id);
  }

  async update(
    id: string,
    dto: UpdateHomestayDto,
    hostId?: string,
  ): Promise<HomestayEntity> {
    const homestay = await this.findById(id);

    if (dto.slug && dto.slug !== homestay.slug) {
      const slugExists = await this.homestayRepository.exist({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    if (hostId) {
      const host = await this.userRepository.findOne({
        where: { id: hostId },
      });
      if (!host) {
        throw new NotFoundException(`Host ${hostId} not found`);
      }
      homestay.host = host;
    }

    if (dto.destinationId !== undefined) {
      if (dto.destinationId === null) {
        homestay.destination = null;
      } else {
        const destination = await this.destinationRepository.findOne({
          where: { id: dto.destinationId },
        });
        if (!destination) {
          throw new NotFoundException(
            `Destination ${dto.destinationId} not found`,
          );
        }
        homestay.destination = destination;
      }
    }

    if (dto.tagIds !== undefined) {
      homestay.tags = dto.tagIds.length
        ? await this.tagRepository.find({ where: { id: In(dto.tagIds) } })
        : [];
    }

    const { destinationId, tagIds, rooms, availabilityBlocks, ...rest } = dto as UpdateHomestayDto & {
      destinationId?: string | null;
      tagIds?: string[];
      rooms?: any[];
      availabilityBlocks?: any[];
    };

    Object.assign(homestay, rest);

    const savedHomestay = await this.homestayRepository.save(homestay);

    // Update nested rooms if provided
    if (rooms !== undefined) {
      // Remove all existing rooms that are not in the new list
      const existingRooms = await this.roomRepository.find({
        where: { homestay: { id } },
      });
      
      for (const existingRoom of existingRooms) {
        await this.roomRepository.remove(existingRoom);
      }

      // Create new rooms
      if (rooms.length > 0) {
        for (const roomDto of rooms) {
          await this.createRoom(savedHomestay.id, roomDto as any);
        }
      }
    }

    // Update nested availability blocks if provided
    if (availabilityBlocks !== undefined) {
      // Remove all existing blocked availability for this homestay
      const existingBlocks = await this.availabilityRepository.find({
        where: {
          homestay: { id },
          status: HomestayAvailabilityStatus.BLOCKED,
        },
      });

      for (const block of existingBlocks) {
        await this.availabilityRepository.remove(block);
      }

      // Create new availability blocks
      if (availabilityBlocks.length > 0) {
        const bulkItems = availabilityBlocks.map((blockDto) => ({
          startDate: blockDto.startDate,
          endDate: blockDto.endDate,
          notes: blockDto.notes || '',
          status: HomestayAvailabilityStatus.BLOCKED,
          roomId: undefined, // No specific room, applies to entire homestay
        }));
        await this.createAvailabilityBulk(savedHomestay.id, bulkItems as any);
      }
    }

    return this.findById(savedHomestay.id);
  }

  async remove(id: string): Promise<void> {
    const homestay = await this.findById(id);
    await this.homestayRepository.remove(homestay);
  }

  async createRoom(
    homestayId: string,
    dto: CreateHomestayRoomDto,
  ): Promise<HomestayRoomEntity> {
    const homestay = await this.homestayRepository.findOne({
      where: { id: homestayId },
    });
    if (!homestay) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    const { slug, ...rest } = dto;
    const resolvedSlug = await this.generateRoomSlug(
      homestayId,
      dto.name,
      slug,
    );

    const room = this.roomRepository.create({
      ...rest,
      slug: resolvedSlug,
      homestay,
    });

    return this.roomRepository.save(room);
  }

  async updateRoom(
    homestayId: string,
    roomId: string,
    dto: UpdateHomestayRoomDto,
  ): Promise<HomestayRoomEntity> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, homestay: { id: homestayId } },
    });

    if (!room) {
      throw new NotFoundException(
        `Room ${roomId} not found in homestay ${homestayId}`,
      );
    }

    if (dto.slug && dto.slug !== room.slug) {
      room.slug = await this.generateRoomSlug(
        homestayId,
        dto.name ?? room.name,
        dto.slug,
      );
    }

    const { slug, ...rest } = dto;
    Object.assign(room, rest);

    return this.roomRepository.save(room);
  }

  async removeRoom(homestayId: string, roomId: string): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, homestay: { id: homestayId } },
    });

    if (!room) {
      throw new NotFoundException(
        `Room ${roomId} not found in homestay ${homestayId}`,
      );
    }

    await this.roomRepository.remove(room);
  }

  async createAvailability(
    homestayId: string,
    dto: CreateHomestayAvailabilityDto,
  ): Promise<HomestayAvailabilityEntity> {
    const homestay = await this.homestayRepository.findOne({
      where: { id: homestayId },
    });
    if (!homestay) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    const startDate = this.coerceDate(dto.startDate, 'startDate');
    const endDate = this.coerceOptionalDate(dto.endDate, 'endDate');

    if (endDate && endDate < startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const room = await this.resolveRoom(homestayId, dto.roomId);
    const { roomId, ...rest } = dto;

    const availability = this.availabilityRepository.create({
      ...rest,
      startDate,
      endDate,
      status: dto.status ?? HomestayAvailabilityStatus.AVAILABLE,
      homestay,
      ...(room ? { room } : {}),
    });

    return this.availabilityRepository.save(availability);
  }

  async createAvailabilityBulk(
    homestayId: string,
    items: CreateHomestayAvailabilityDto[],
  ): Promise<HomestayAvailabilityEntity[]> {
    if (!items.length) {
      return [];
    }

    const homestay = await this.homestayRepository.findOne({
      where: { id: homestayId },
    });
    if (!homestay) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    const availabilities: HomestayAvailabilityEntity[] = [];

    for (const item of items) {
      const startDate = this.coerceDate(item.startDate, 'startDate');
      const endDate = this.coerceOptionalDate(item.endDate, 'endDate');

      if (endDate && endDate < startDate) {
        throw new BadRequestException('endDate must be after startDate');
      }

      const room = await this.resolveRoom(homestayId, item.roomId);
      const { roomId, ...rest } = item;

      const availability = this.availabilityRepository.create({
        ...rest,
        startDate,
        endDate,
        status: item.status ?? HomestayAvailabilityStatus.AVAILABLE,
        homestay,
        ...(room ? { room } : {}),
      });

      availabilities.push(availability);
    }

    return this.availabilityRepository.save(availabilities);
  }

  async updateAvailability(
    homestayId: string,
    availabilityId: string,
    dto: UpdateHomestayAvailabilityDto,
  ): Promise<HomestayAvailabilityEntity> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId, homestay: { id: homestayId } },
      relations: ['room'],
    });

    if (!availability) {
      throw new NotFoundException(
        `Availability ${availabilityId} not found in homestay ${homestayId}`,
      );
    }

    const { roomId, startDate, endDate, ...rest } = dto;

    if (startDate) {
      availability.startDate = this.coerceDate(startDate, 'startDate');
    }
    if (endDate !== undefined) {
      availability.endDate = this.coerceOptionalDate(endDate, 'endDate');
    }
    if (availability.endDate && availability.endDate < availability.startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    if (roomId !== undefined) {
      availability.room = await this.resolveRoom(homestayId, roomId);
    }

    Object.assign(availability, rest);

    return this.availabilityRepository.save(availability);
  }

  async removeAvailability(
    homestayId: string,
    availabilityId: string,
  ): Promise<void> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId, homestay: { id: homestayId } },
    });

    if (!availability) {
      throw new NotFoundException(
        `Availability ${availabilityId} not found in homestay ${homestayId}`,
      );
    }

    await this.availabilityRepository.remove(availability);
  }

  async createPricingRule(
    homestayId: string,
    dto: CreateHomestayPricingRuleDto,
  ): Promise<HomestayPricingRuleEntity> {
    const homestay = await this.homestayRepository.findOne({
      where: { id: homestayId },
    });
    if (!homestay) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    const startDate = this.coerceDate(dto.startDate, 'startDate');
    const endDate = this.coerceDate(dto.endDate, 'endDate');

    if (endDate < startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const pricingRule = this.pricingRuleRepository.create({
      ...dto,
      startDate,
      endDate,
      daysOfWeek: dto.daysOfWeek ?? null,
      homestay,
    });

    return this.pricingRuleRepository.save(pricingRule);
  }

  async updatePricingRule(
    homestayId: string,
    ruleId: string,
    dto: UpdateHomestayPricingRuleDto,
  ): Promise<HomestayPricingRuleEntity> {
    const pricingRule = await this.pricingRuleRepository.findOne({
      where: { id: ruleId, homestay: { id: homestayId } },
    });

    if (!pricingRule) {
      throw new NotFoundException(
        `Pricing rule ${ruleId} not found in homestay ${homestayId}`,
      );
    }

    const { startDate, endDate, daysOfWeek, ...rest } = dto;

    if (startDate) {
      pricingRule.startDate = this.coerceDate(startDate, 'startDate');
    }
    if (endDate) {
      pricingRule.endDate = this.coerceDate(endDate, 'endDate');
    }
    if (pricingRule.endDate < pricingRule.startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    if (daysOfWeek !== undefined) {
      pricingRule.daysOfWeek = daysOfWeek ?? null;
    }

    Object.assign(pricingRule, rest);

    return this.pricingRuleRepository.save(pricingRule);
  }

  async removePricingRule(homestayId: string, ruleId: string): Promise<void> {
    const pricingRule = await this.pricingRuleRepository.findOne({
      where: { id: ruleId, homestay: { id: homestayId } },
    });

    if (!pricingRule) {
      throw new NotFoundException(
        `Pricing rule ${ruleId} not found in homestay ${homestayId}`,
      );
    }

    await this.pricingRuleRepository.remove(pricingRule);
  }

  async getDashboardMetrics(): Promise<HomestayDashboardMetrics> {
    const [
      totalHomestays,
      publishedHomestays,
      draftHomestays,
      archivedHomestays,
      totalBookings,
      totalRevenueRaw,
      averageRatingRaw,
    ] = await Promise.all([
      this.homestayRepository.count(),
      this.homestayRepository.count({
        where: { status: HomestayStatus.PUBLISHED },
      }),
      this.homestayRepository.count({
        where: { status: HomestayStatus.DRAFT },
      }),
      this.homestayRepository.count({
        where: { status: HomestayStatus.ARCHIVED },
      }),
      this.bookingRepository.count(),
      this.bookingRepository
        .createQueryBuilder('booking')
        .select('SUM(booking.totalPrice)', 'total')
        .getRawOne<{ total: string | null }>(),
      this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.overallRating)', 'average')
        .getRawOne<{ average: string | null }>(),
    ]);

    const totalRevenue = totalRevenueRaw?.total
      ? Number(totalRevenueRaw.total)
      : 0;
    const averageRating = averageRatingRaw?.average
      ? Number(averageRatingRaw.average)
      : 0;

    return {
      totalHomestays,
      publishedHomestays,
      draftHomestays,
      archivedHomestays,
      totalBookings,
      totalRevenue,
      averageRating,
    };
  }

  async getStatistics(): Promise<HomestayDashboardMetrics> {
    return this.getDashboardMetrics();
  }

  async getAnalytics(): Promise<HomestayAnalytics> {
    const [statusRaw, totals, pricingRaw, topDestinationsRaw, bookingDates] =
      await Promise.all([
        this.homestayRepository
          .createQueryBuilder('homestay')
          .select('homestay.status', 'status')
          .addSelect('COUNT(homestay.id)', 'count')
          .groupBy('homestay.status')
          .getRawMany<{ status: HomestayStatus; count: string }>(),
        Promise.all([
          this.homestayRepository.count(),
          this.bookingRepository.count(),
          this.reviewRepository.count(),
        ]),
        this.homestayRepository
          .createQueryBuilder('homestay')
          .select('AVG(homestay.basePrice)', 'avg')
          .addSelect('MIN(homestay.basePrice)', 'min')
          .addSelect('MAX(homestay.basePrice)', 'max')
          .where('homestay.basePrice IS NOT NULL')
          .getRawOne<{
            avg: string | null;
            min: string | null;
            max: string | null;
          }>(),
        this.homestayRepository
          .createQueryBuilder('homestay')
          .leftJoin('homestay.destination', 'destination')
          .select('destination.id', 'destinationId')
          .addSelect('destination.name', 'name')
          .addSelect('destination.slug', 'slug')
          .addSelect('COUNT(homestay.id)', 'count')
          .where('destination.id IS NOT NULL')
          .groupBy('destination.id')
          .addGroupBy('destination.name')
          .addGroupBy('destination.slug')
          .orderBy('count', 'DESC')
          .limit(5)
          .getRawMany<{
            destinationId: string;
            name: string;
            slug: string | null;
            count: string;
          }>(),
        this.bookingRepository.find({
          select: ['checkInDate'],
          where: {
            checkInDate: MoreThanOrEqual(
              new Date(
                Date.UTC(
                  new Date().getUTCFullYear(),
                  new Date().getUTCMonth() - 5,
                  1,
                ),
              ),
            ),
          },
        }),
      ]);

    const [totalHomestays, totalBookings, totalReviews] = totals;

    const statusBreakdown = Object.values(HomestayStatus).reduce(
      (acc, status) => {
        const entry = statusRaw.find((row) => row.status === status);
        acc[status] = entry ? Number(entry.count) : 0;
        return acc;
      },
      {} as Record<HomestayStatus, number>,
    );

    const [featured, verified, instantBook, superhost] = await Promise.all([
      this.homestayRepository.count({ where: { isFeatured: true } }),
      this.homestayRepository.count({ where: { isVerified: true } }),
      this.homestayRepository.count({ where: { isInstantBook: true } }),
      this.homestayRepository.count({ where: { isSuperhost: true } }),
    ]);

    const pricing = {
      averageBasePrice: pricingRaw?.avg ? Number(pricingRaw.avg) : null,
      minBasePrice: pricingRaw?.min ? Number(pricingRaw.min) : null,
      maxBasePrice: pricingRaw?.max ? Number(pricingRaw.max) : null,
    };

    const topDestinations = topDestinationsRaw.map((row) => ({
      destinationId: row.destinationId,
      name: row.name,
      slug: row.slug,
      homestayCount: Number(row.count),
    }));

    const trendMap = new Map<string, number>();
    bookingDates.forEach((booking) => {
      const date = booking.checkInDate;
      if (!date) {
        return;
      }
      const monthKey = `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1,
      ).padStart(2, '0')}`;
      trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + 1);
    });

    const bookingTrends: { month: string; bookings: number }[] = [];
    const current = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const iterator = new Date(
        Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - i, 1),
      );
      const key = `${iterator.getUTCFullYear()}-${String(
        iterator.getUTCMonth() + 1,
      ).padStart(2, '0')}`;
      bookingTrends.push({
        month: key,
        bookings: trendMap.get(key) ?? 0,
      });
    }

    return {
      totals: {
        homestays: totalHomestays,
        bookings: totalBookings,
        reviews: totalReviews,
      },
      statusBreakdown,
      featureFlags: {
        featured,
        verified,
        instantBook,
        superhost,
      },
      pricing,
      topDestinations,
      bookingTrends,
    };
  }

  async exportHomestays(query: HomestayQueryDto): Promise<string> {
    const exportQuery = {
      ...query,
      page: 1,
      limit: Math.min(query.limit ?? MAX_EXPORT_LIMIT, MAX_EXPORT_LIMIT),
    };
    const { data } = await this.findAll(exportQuery);

    const header = [
      'id',
      'title',
      'slug',
      'status',
      'type',
      'category',
      'city',
      'country',
      'basePrice',
      'currency',
      'maxGuests',
      'bedrooms',
      'bathrooms',
      'isFeatured',
      'isVerified',
      'isInstantBook',
      'isSuperhost',
      'destination',
      'host',
      'rooms',
      'amenities',
    ];

    const rows = data.map((homestay) => [
      homestay.id,
      homestay.name,
      homestay.slug,
      homestay.status,
      homestay.type,
      homestay.category,
      homestay.city ?? '',
      homestay.country ?? '',
      homestay.basePrice ?? '',
      homestay.currency ?? '',
      homestay.maxGuests ?? '',
      homestay.bedrooms ?? '',
      homestay.bathrooms ?? '',
      homestay.isFeatured ? 'true' : 'false',
      homestay.isVerified ? 'true' : 'false',
      homestay.isInstantBook ? 'true' : 'false',
      homestay.isSuperhost ? 'true' : 'false',
      homestay.destination
        ? `${homestay.destination.name} (${homestay.destination.slug})`
        : '',
      homestay.host ? homestay.host.fullName : '',
      homestay.rooms?.length ?? 0,
      homestay.amenities?.join('|') ?? '',
    ]);

    const serialized = [header, ...rows]
      .map((row) => row.map((value) => this.escapeCsv(value)).join(','))
      .join('\n');

    return serialized;
  }

  async processBulkAction(actionId: string, ids: string[]) {
    if (!ids.length) {
      return { action: actionId, affected: 0 };
    }

    const normalizedAction = actionId.toLowerCase();
    let affected = 0;

    switch (normalizedAction) {
      case 'publish': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { status: HomestayStatus.PUBLISHED },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'archive': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { status: HomestayStatus.ARCHIVED },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'draft': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { status: HomestayStatus.DRAFT },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'feature': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { isFeatured: true },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'unfeature': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { isFeatured: false },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'verify': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { isVerified: true },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'unverify': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { isVerified: false },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'instant-book': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { isInstantBook: true },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'disable-instant-book': {
        const result = await this.homestayRepository.update(
          { id: In(ids) },
          { isInstantBook: false },
        );
        affected = result.affected ?? 0;
        break;
      }
      case 'delete': {
        const homestays = await this.homestayRepository.find({
          where: { id: In(ids) },
        });
        affected = homestays.length;
        await this.homestayRepository.remove(homestays);
        break;
      }
      default:
        throw new BadRequestException(`Unknown bulk action: ${actionId}`);
    }

    return { action: normalizedAction, affected };
  }

  private async filterByAvailability(
    homestays: HomestayEntity[],
    checkInDate: string,
    checkOutDate: string,
  ): Promise<HomestayEntity[]> {
    const availableHomestays: HomestayEntity[] = [];

    for (const homestay of homestays) {
      const isAvailable = await this.checkAvailability(
        homestay.id,
        checkInDate,
        checkOutDate,
      );
      if (isAvailable) {
        availableHomestays.push(homestay);
      }
    }

    return availableHomestays;
  }

  private async checkAvailability(
    homestayId: string,
    checkInDate: string,
    checkOutDate: string,
  ): Promise<boolean> {
    const start = this.coerceDate(checkInDate, 'checkInDate');
    const end = this.coerceDate(checkOutDate, 'checkOutDate');

    if (end <= start) {
      throw new BadRequestException('checkOutDate must be after checkInDate');
    }

    const conflictingBookings = await this.bookingRepository.count({
      where: {
        homestay: { id: homestayId },
        status: In([
          HomestayBookingStatus.CONFIRMED,
          HomestayBookingStatus.CHECKED_IN,
        ]),
        checkInDate: LessThan(end),
        checkOutDate: MoreThan(start),
      },
    });

    return conflictingBookings === 0;
  }

  private async resolveRoom(
    homestayId: string,
    roomId?: string,
  ): Promise<HomestayRoomEntity | null> {
    if (!roomId) {
      return null;
    }
    const room = await this.roomRepository.findOne({
      where: { id: roomId, homestay: { id: homestayId } },
    });
    if (!room) {
      throw new NotFoundException(
        `Room ${roomId} not found in homestay ${homestayId}`,
      );
    }
    return room;
  }

  private coerceDate(value: string | Date, field: string): Date {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid ${field}`);
    }
    return date;
  }

  private coerceOptionalDate(
    value: string | Date | undefined,
    field: string,
  ): Date | null {
    if (value === undefined || value === null) {
      return null;
    }
    return this.coerceDate(value, field);
  }

  private async generateRoomSlug(
    homestayId: string,
    name: string,
    slug?: string,
  ): Promise<string> {
    const baseSlug = (slug ?? this.slugify(name)).slice(0, 180);
    let candidate = baseSlug;
    let counter = 1;
    while (
      await this.roomRepository.exist({
        where: { slug: candidate, homestay: { id: homestayId } },
      })
    ) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }
    return candidate;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  private escapeCsv(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    const str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
