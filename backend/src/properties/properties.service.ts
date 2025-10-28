import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyQueryDto } from './dto/property-query.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { TagEntity } from '../tags/tag.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly repository: Repository<PropertyEntity>,
    @InjectRepository(DestinationEntity)
    private readonly destinationsRepository: Repository<DestinationEntity>,
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  async findAll(
    query: PropertyQueryDto,
  ): Promise<{ data: PropertyEntity[]; total: number }> {
    const { page = 1, limit = 20, search, destinationId, status, type } = query;

    const where: Record<string, any>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ slug: ILike(`%${search}%`) });
      where.push({ summary: ILike(`%${search}%`) });
      where.push({ city: ILike(`%${search}%`) });
    }

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({
            ...condition,
            ...(destinationId ? { destination: { id: destinationId } } : {}),
            ...(status ? { status } : {}),
            ...(type ? { type } : {}),
          }))
        : {
            ...(destinationId ? { destination: { id: destinationId } } : {}),
            ...(status ? { status } : {}),
            ...(type ? { type } : {}),
          },
      relations: {
        destination: true,
        tags: true,
        rooms: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<PropertyEntity> {
    const property = await this.repository.findOne({
      where: { id },
      relations: {
        destination: true,
        tags: true,
        rooms: true,
      },
    });
    if (!property) {
      throw new NotFoundException(`Property ${id} not found`);
    }
    return property;
  }

  async create(dto: CreatePropertyDto): Promise<PropertyEntity> {
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

    const tags = dto.tagIds?.length
      ? await this.tagsRepository.find({ where: { id: In(dto.tagIds) } })
      : [];

    const { destinationId, tagIds, ...rest } = dto;

    const property = this.repository.create({
      ...rest,
      destination: destination ?? undefined,
      tags,
    });

    return this.repository.save(property);
  }

  async update(id: string, dto: UpdatePropertyDto): Promise<PropertyEntity> {
    const property = await this.findById(id);

    if (dto.slug && dto.slug !== property.slug) {
      const slugExists = await this.repository.exist({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    if (dto.destinationId !== undefined) {
      if (dto.destinationId === null) {
        property.destination = null;
      } else {
        const destination = await this.destinationsRepository.findOne({
          where: { id: dto.destinationId },
        });
        if (!destination) {
          throw new NotFoundException(
            `Destination ${dto.destinationId} not found`,
          );
        }
        property.destination = destination;
      }
    }

    if (dto.tagIds !== undefined) {
      property.tags = dto.tagIds.length
        ? await this.tagsRepository.find({ where: { id: In(dto.tagIds) } })
        : [];
    }

    const { destinationId, tagIds, ...rest } = dto;

    Object.assign(property, rest);

    return this.repository.save(property);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findById(id);
    await this.repository.remove(property);
  }
}
