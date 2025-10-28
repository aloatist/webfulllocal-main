import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { DestinationEntity } from './destination.entity';
import { DestinationQueryDto } from './dto/destination-query.dto';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(DestinationEntity)
    private readonly repository: Repository<DestinationEntity>,
  ) {}

  async findAll(
    query: DestinationQueryDto,
  ): Promise<{ data: DestinationEntity[]; total: number }> {
    const { page = 1, limit = 20, search, type, featured } = query;

    const where: Record<string, any>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ slug: ILike(`%${search}%`) });
      where.push({ summary: ILike(`%${search}%`) });
    }

    const isFeatured =
      featured !== undefined
        ? featured === 'true' || featured === '1'
        : undefined;

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({
            ...condition,
            ...(type ? { type } : {}),
            ...(isFeatured !== undefined ? { isFeatured } : {}),
          }))
        : {
            ...(type ? { type } : {}),
            ...(isFeatured !== undefined ? { isFeatured } : {}),
          },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        properties: true,
        experiences: true,
        restaurants: true,
        bookings: true,
      },
    });

    return { data, total };
  }

  async findById(id: string): Promise<DestinationEntity> {
    const destination = await this.repository.findOne({
      where: { id },
      relations: {
        properties: true,
        experiences: true,
        restaurants: true,
        bookings: true,
      },
    });
    if (!destination) {
      throw new NotFoundException(`Destination ${id} not found`);
    }
    return destination;
  }

  async create(dto: CreateDestinationDto): Promise<DestinationEntity> {
    const slugExists = await this.repository.exist({
      where: { slug: dto.slug },
    });
    if (slugExists) {
      throw new BadRequestException('Slug already exists');
    }

    const destination = this.repository.create({
      ...dto,
      isFeatured: dto.isFeatured ?? false,
    });

    return this.repository.save(destination);
  }

  async update(
    id: string,
    dto: UpdateDestinationDto,
  ): Promise<DestinationEntity> {
    const destination = await this.findById(id);

    if (dto.slug && dto.slug !== destination.slug) {
      const slugExists = await this.repository.exist({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    Object.assign(destination, dto);
    return this.repository.save(destination);
  }

  async remove(id: string): Promise<void> {
    const destination = await this.findById(id);
    await this.repository.remove(destination);
  }
}
