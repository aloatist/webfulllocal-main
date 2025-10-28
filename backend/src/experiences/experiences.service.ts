import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ExperienceEntity } from './experience.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';
import { ExperienceQueryDto } from './dto/experience-query.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private readonly repository: Repository<ExperienceEntity>,
    @InjectRepository(DestinationEntity)
    private readonly destinationsRepository: Repository<DestinationEntity>,
    @InjectRepository(PropertyEntity)
    private readonly propertiesRepository: Repository<PropertyEntity>,
  ) {}

  async findAll(
    query: ExperienceQueryDto,
  ): Promise<{ data: ExperienceEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status,
      destinationId,
      propertyId,
    } = query;

    const where: Record<string, any>[] = [];

    if (search) {
      where.push({ title: ILike(`%${search}%`) });
      where.push({ slug: ILike(`%${search}%`) });
      where.push({ summary: ILike(`%${search}%`) });
    }

    const filters = {
      ...(category ? { category } : {}),
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

  async findById(id: string): Promise<ExperienceEntity> {
    const experience = await this.repository.findOne({
      where: { id },
      relations: { destination: true, property: true },
    });
    if (!experience) {
      throw new NotFoundException(`Experience ${id} not found`);
    }
    return experience;
  }

  async create(dto: CreateExperienceDto): Promise<ExperienceEntity> {
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

    const { destinationId, propertyId, priceFrom, ...rest } = dto;

    const experience = this.repository.create({
      ...rest,
      priceFrom: priceFrom !== undefined ? priceFrom.toFixed(2) : null,
      destination: destination ?? undefined,
      property: property ?? undefined,
    });

    return this.repository.save(experience);
  }

  async update(
    id: string,
    dto: UpdateExperienceDto,
  ): Promise<ExperienceEntity> {
    const experience = await this.findById(id);

    if (dto.slug && dto.slug !== experience.slug) {
      const slugExists = await this.repository.exist({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    if (dto.destinationId !== undefined) {
      if (dto.destinationId === null) {
        experience.destination = null;
      } else {
        const destination = await this.destinationsRepository.findOne({
          where: { id: dto.destinationId },
        });
        if (!destination) {
          throw new NotFoundException(
            `Destination ${dto.destinationId} not found`,
          );
        }
        experience.destination = destination;
      }
    }

    if (dto.propertyId !== undefined) {
      if (dto.propertyId === null) {
        experience.property = null;
      } else {
        const property = await this.propertiesRepository.findOne({
          where: { id: dto.propertyId },
        });
        if (!property) {
          throw new NotFoundException(`Property ${dto.propertyId} not found`);
        }
        experience.property = property;
      }
    }

    if (dto.priceFrom !== undefined) {
      experience.priceFrom = dto.priceFrom.toFixed(2);
    }

    const { destinationId, propertyId, priceFrom, ...rest } = dto;
    Object.assign(experience, rest);

    return this.repository.save(experience);
  }

  async remove(id: string): Promise<void> {
    const experience = await this.findById(id);
    await this.repository.remove(experience);
  }
}
