import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import {
  BookingEntity,
  BookingPaymentStatus,
  BookingSource,
  BookingStatus,
  BookingType,
} from './booking.entity';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';
import { PropertyRoomEntity } from '../rooms/property-room.entity';
import { ExperienceEntity } from '../experiences/experience.entity';
import { RestaurantEntity } from '../restaurants/restaurant.entity';
import { CustomerEntity } from '../customers/customer.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly repository: Repository<BookingEntity>,
    @InjectRepository(DestinationEntity)
    private readonly destinationsRepository: Repository<DestinationEntity>,
    @InjectRepository(PropertyEntity)
    private readonly propertiesRepository: Repository<PropertyEntity>,
    @InjectRepository(PropertyRoomEntity)
    private readonly roomsRepository: Repository<PropertyRoomEntity>,
    @InjectRepository(ExperienceEntity)
    private readonly experiencesRepository: Repository<ExperienceEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantsRepository: Repository<RestaurantEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customersRepository: Repository<CustomerEntity>,
  ) {}

  async findAll(
    query: BookingQueryDto,
  ): Promise<{ data: BookingEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      type,
      source,
      startDate,
      endDate,
      destinationId,
      propertyId,
    } = query;

    const where: Record<string, any>[] = [];

    if (search) {
      where.push({ referenceCode: ILike(`%${search}%`) });
      where.push({ customerName: ILike(`%${search}%`) });
      where.push({ customerEmail: ILike(`%${search}%`) });
    }

    const filters = {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
      ...(source ? { source } : {}),
      ...(destinationId ? { destination: { id: destinationId } } : {}),
      ...(propertyId ? { property: { id: propertyId } } : {}),
    } as Record<string, any>;

    if (startDate && endDate) {
      filters.createdAt = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      filters.createdAt = Between(new Date(startDate), new Date());
    }

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({ ...condition, ...filters }))
        : filters,
      relations: {
        destination: true,
        property: true,
        room: true,
        experience: true,
        restaurant: true,
        customer: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<BookingEntity> {
    const booking = await this.repository.findOne({
      where: { id },
      relations: {
        destination: true,
        property: true,
        room: true,
        experience: true,
        restaurant: true,
        customer: true,
      },
    });
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return booking;
  }

  async create(dto: CreateBookingDto): Promise<BookingEntity> {
    const refExists = await this.repository.exist({
      where: { referenceCode: dto.referenceCode },
    });
    if (refExists) {
      throw new BadRequestException('Reference code already exists');
    }

    const relations = await this.resolveRelations(dto);

    const booking = this.repository.create({
      ...dto,
      totalAmount: dto.totalAmount.toFixed(2),
      currency: dto.currency ?? 'VND',
      depositAmount:
        dto.depositAmount !== undefined ? dto.depositAmount.toFixed(2) : null,
      paymentStatus: dto.paymentStatus ?? BookingPaymentStatus.UNPAID,
      status: dto.status ?? BookingStatus.PENDING,
      type: dto.type ?? BookingType.ACCOMMODATION,
      source: dto.source ?? BookingSource.WEBSITE,
      adultCount: dto.adultCount ?? 1,
      childCount: dto.childCount ?? 0,
      infantCount: dto.infantCount ?? 0,
      ...relations,
    });

    return this.repository.save(booking);
  }

  async update(id: string, dto: UpdateBookingDto): Promise<BookingEntity> {
    const booking = await this.findById(id);

    if (dto.referenceCode && dto.referenceCode !== booking.referenceCode) {
      const refExists = await this.repository.exist({
        where: { referenceCode: dto.referenceCode },
      });
      if (refExists) {
        throw new BadRequestException('Reference code already exists');
      }
    }

    const relations = await this.resolveRelations(dto, booking);

    if (dto.totalAmount !== undefined) {
      booking.totalAmount = dto.totalAmount.toFixed(2);
    }

    if (dto.depositAmount !== undefined) {
      booking.depositAmount =
        dto.depositAmount !== null ? dto.depositAmount.toFixed(2) : null;
    }

    const {
      totalAmount,
      depositAmount,
      referenceCode,
      destinationId,
      propertyId,
      roomId,
      experienceId,
      restaurantId,
      customerId,
      ...rest
    } = dto;

    Object.assign(booking, rest, relations);

    if (dto.referenceCode) {
      booking.referenceCode = dto.referenceCode;
    }

    return this.repository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findById(id);
    await this.repository.remove(booking);
  }

  private async resolveRelations(
    dto: Partial<CreateBookingDto>,
    current?: BookingEntity,
  ): Promise<Partial<BookingEntity>> {
    const relations: Partial<BookingEntity> = {};

    if (dto.destinationId !== undefined) {
      if (dto.destinationId === null) {
        relations.destination = null;
      } else {
        const destination = await this.destinationsRepository.findOne({
          where: { id: dto.destinationId },
        });
        if (!destination) {
          throw new NotFoundException(
            `Destination ${dto.destinationId} not found`,
          );
        }
        relations.destination = destination;
      }
    }

    if (dto.propertyId !== undefined) {
      if (dto.propertyId === null) {
        relations.property = null;
      } else {
        const property = await this.propertiesRepository.findOne({
          where: { id: dto.propertyId },
        });
        if (!property) {
          throw new NotFoundException(`Property ${dto.propertyId} not found`);
        }
        relations.property = property;
      }
    }

    if (dto.roomId !== undefined) {
      if (dto.roomId === null) {
        relations.room = null;
      } else {
        const room = await this.roomsRepository.findOne({
          where: { id: dto.roomId },
        });
        if (!room) {
          throw new NotFoundException(`Room ${dto.roomId} not found`);
        }
        relations.room = room;
      }
    }

    if (dto.experienceId !== undefined) {
      if (dto.experienceId === null) {
        relations.experience = null;
      } else {
        const experience = await this.experiencesRepository.findOne({
          where: { id: dto.experienceId },
        });
        if (!experience) {
          throw new NotFoundException(
            `Experience ${dto.experienceId} not found`,
          );
        }
        relations.experience = experience;
      }
    }

    if (dto.restaurantId !== undefined) {
      if (dto.restaurantId === null) {
        relations.restaurant = null;
      } else {
        const restaurant = await this.restaurantsRepository.findOne({
          where: { id: dto.restaurantId },
        });
        if (!restaurant) {
          throw new NotFoundException(
            `Restaurant ${dto.restaurantId} not found`,
          );
        }
        relations.restaurant = restaurant;
      }
    }

    if (dto.customerId !== undefined) {
      if (dto.customerId === null) {
        relations.customer = null;
      } else {
        const customer = await this.customersRepository.findOne({
          where: { id: dto.customerId },
        });
        if (!customer) {
          throw new NotFoundException(`Customer ${dto.customerId} not found`);
        }
        relations.customer = customer;
      }
    } else if (!dto.customerId && dto.customerEmail && !current?.customer) {
      // Optional: auto-link existing customer by email
      const existingCustomer = await this.customersRepository.findOne({
        where: { email: dto.customerEmail },
      });
      if (existingCustomer) {
        relations.customer = existingCustomer;
      }
    }

    return relations;
  }
}
