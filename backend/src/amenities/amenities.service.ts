import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { AmenityQueryDto } from './dto/amenity-query.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { AmenityEntity } from './amenity.entity';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(AmenityEntity)
    private readonly repository: Repository<AmenityEntity>,
  ) {}

  async findAll(
    query: AmenityQueryDto,
  ): Promise<{ data: AmenityEntity[]; total: number }> {
    const { page = 1, limit = 20, search, category } = query;
    const whereClauses: Record<string, any>[] = [];

    if (search) {
      whereClauses.push({ name: ILike(`%${search}%`) });
      whereClauses.push({ code: ILike(`%${search}%`) });
    }

    const [data, total] = await this.repository.findAndCount({
      where: whereClauses.length
        ? whereClauses.map((clause) => ({
            ...clause,
            ...(category ? { category } : {}),
          }))
        : category
          ? { category }
          : undefined,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<AmenityEntity> {
    const amenity = await this.repository.findOne({ where: { id } });
    if (!amenity) {
      throw new NotFoundException(`Amenity ${id} not found`);
    }
    return amenity;
  }

  async findByCode(code: string): Promise<AmenityEntity | null> {
    return this.repository.findOne({ where: { code } });
  }

  async create(dto: CreateAmenityDto): Promise<AmenityEntity> {
    const amenity = this.repository.create({
      ...dto,
      category: dto.category ?? undefined,
      icon: dto.icon ?? null,
    });
    return this.repository.save(amenity);
  }

  async update(id: string, dto: UpdateAmenityDto): Promise<AmenityEntity> {
    const amenity = await this.findById(id);
    Object.assign(amenity, dto);
    return this.repository.save(amenity);
  }

  async remove(id: string): Promise<void> {
    const amenity = await this.findById(id);
    await this.repository.remove(amenity);
  }
}
