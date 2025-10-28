import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';
import { RestaurantQueryDto } from './dto/restaurant-query.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly repository: Repository<RestaurantEntity>,
    @InjectRepository(DestinationEntity)
    private readonly destinationsRepository: Repository<DestinationEntity>,
    @InjectRepository(PropertyEntity)
    private readonly propertiesRepository: Repository<PropertyEntity>,
  ) {}

  async findAll(
    query: RestaurantQueryDto,
  ): Promise<{ data: RestaurantEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      priceLevel,
      status,
      destinationId,
      propertyId,
    } = query;

    const where: Record<string, any>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ slug: ILike(`%${search}%`) });
      where.push({ city: ILike(`%${search}%`) });
      where.push({ summary: ILike(`%${search}%`) });
    }

    const filters = {
      ...(type ? { type } : {}),
      ...(priceLevel ? { priceLevel } : {}),
      ...(status ? { status } : {}),
      ...(destinationId ? { destination: { id: destinationId } } : {}),
      ...(propertyId ? { property: { id: propertyId } } : {}),
    };

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({ ...condition, ...filters }))
        : filters,
      relations: { destination: true, property: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.repository.findOne({
      where: { id },
      relations: { destination: true, property: true },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${id} not found`);
    }
    return restaurant;
  }

  async create(dto: CreateRestaurantDto): Promise<RestaurantEntity> {
    const slugExists = await this.repository.exist({
      where: { slug: dto.slug },
    });
    if (slugExists) {
      throw new BadRequestException('Slug already exists');
    }

    const destination = dto.destinationId
      ? await this.destinationsRepository.findOne({
          where: { id: dto.destinationId },
        })
      : null;
    if (dto.destinationId && !destination) {
      throw new NotFoundException(`Destination ${dto.destinationId} not found`);
    }

    const property = dto.propertyId
      ? await this.propertiesRepository.findOne({
          where: { id: dto.propertyId },
        })
      : null;
    if (dto.propertyId && !property) {
      throw new NotFoundException(`Property ${dto.propertyId} not found`);
    }

    const { destinationId, propertyId, averagePrice, ...rest } = dto;

    const restaurant = this.repository.create({
      ...rest,
      averagePrice: averagePrice !== undefined ? averagePrice.toFixed(2) : null,
      destination: destination ?? undefined,
      property: property ?? undefined,
    });

    return this.repository.save(restaurant);
  }

  async update(
    id: string,
    dto: UpdateRestaurantDto,
  ): Promise<RestaurantEntity> {
    const restaurant = await this.findById(id);

    if (dto.slug && dto.slug !== restaurant.slug) {
      const slugExists = await this.repository.exist({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    if (dto.destinationId !== undefined) {
      if (dto.destinationId === null) {
        restaurant.destination = null;
      } else {
        const destination = await this.destinationsRepository.findOne({
          where: { id: dto.destinationId },
        });
        if (!destination) {
          throw new NotFoundException(
            `Destination ${dto.destinationId} not found`,
          );
        }
        restaurant.destination = destination;
      }
    }

    if (dto.propertyId !== undefined) {
      if (dto.propertyId === null) {
        restaurant.property = null;
      } else {
        const property = await this.propertiesRepository.findOne({
          where: { id: dto.propertyId },
        });
        if (!property) {
          throw new NotFoundException(`Property ${dto.propertyId} not found`);
        }
        restaurant.property = property;
      }
    }

    if (dto.averagePrice !== undefined) {
      restaurant.averagePrice = dto.averagePrice.toFixed(2);
    }

    const { destinationId, propertyId, averagePrice, ...rest } = dto;
    Object.assign(restaurant, rest);

    return this.repository.save(restaurant);
  }

  async remove(id: string): Promise<void> {
    const restaurant = await this.findById(id);
    await this.repository.remove(restaurant);
  }
}
