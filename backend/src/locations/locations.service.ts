import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationQueryDto } from './dto/location-query.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repository: Repository<LocationEntity>,
  ) {}

  async findAll(
    query: LocationQueryDto,
  ): Promise<{ data: LocationEntity[]; total: number }> {
    const { page = 1, limit = 20, search, type, parentId } = query;
    const whereClauses: Record<string, any>[] = [];

    if (search) {
      whereClauses.push({ name: ILike(`%${search}%`) });
      whereClauses.push({ slug: ILike(`%${search}%`) });
    }

    const filter = parentId ? { parent: { id: parentId } } : {};
    const typeFilter = type ? { type } : {};

    const [data, total] = await this.repository.findAndCount({
      where: whereClauses.length
        ? whereClauses.map((clause) => ({
            ...clause,
            ...typeFilter,
            ...filter,
          }))
        : {
            ...typeFilter,
            ...filter,
          },
      relations: { parent: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<LocationEntity> {
    const location = await this.repository.findOne({
      where: { id },
      relations: { parent: true },
    });
    if (!location) {
      throw new NotFoundException(`Location ${id} not found`);
    }
    return location;
  }

  async create(dto: CreateLocationDto): Promise<LocationEntity> {
    const parent = dto.parentId
      ? await this.resolveParent(dto.parentId)
      : undefined;

    const location = this.repository.create({
      name: dto.name,
      slug: dto.slug,
      type: dto.type,
      description: dto.description,
      parent: parent ?? null,
      latitude: dto.latitude,
      longitude: dto.longitude,
      metadata: dto.metadata,
    });

    return this.repository.save(location);
  }

  async update(id: string, dto: UpdateLocationDto): Promise<LocationEntity> {
    const location = await this.findById(id);

    if (dto.parentId !== undefined) {
      if (!dto.parentId) {
        location.parent = null;
      } else {
        if (dto.parentId === id) {
          throw new BadRequestException('Location cannot be its own parent');
        }
        const parent = await this.resolveParent(dto.parentId);
        await this.ensureNotDescendant(id, parent.id);
        location.parent = parent;
      }
    }

    if (dto.name !== undefined) {
      location.name = dto.name;
    }
    if (dto.slug !== undefined) {
      location.slug = dto.slug;
    }
    if (dto.type !== undefined) {
      location.type = dto.type;
    }
    if (dto.description !== undefined) {
      location.description = dto.description;
    }
    if (dto.latitude !== undefined) {
      location.latitude = dto.latitude;
    }
    if (dto.longitude !== undefined) {
      location.longitude = dto.longitude;
    }
    if (dto.metadata !== undefined) {
      location.metadata = dto.metadata;
    }

    return this.repository.save(location);
  }

  async remove(id: string): Promise<void> {
    const location = await this.findById(id);
    const childCount = await this.repository.count({
      where: { parent: { id } },
    });
    if (childCount > 0) {
      throw new BadRequestException(
        'Cannot delete a location that has children',
      );
    }
    await this.repository.remove(location);
  }

  async getChildren(id: string): Promise<LocationEntity[]> {
    return this.repository.find({
      where: { parent: { id } },
      order: { name: 'ASC' },
    });
  }

  private async resolveParent(id: string): Promise<LocationEntity> {
    const parent = await this.repository.findOne({ where: { id } });
    if (!parent) {
      throw new NotFoundException(`Parent location ${id} not found`);
    }
    return parent;
  }

  private async ensureNotDescendant(id: string, parentId: string) {
    if (id === parentId) {
      throw new BadRequestException('Location cannot be its own parent');
    }

    let currentParentId: string | null = parentId;
    while (currentParentId) {
      const current = await this.repository.findOne({
        where: { id: currentParentId },
        relations: { parent: true },
      });
      if (!current || !current.parent) {
        break;
      }
      if (current.parent.id === id) {
        throw new BadRequestException('Circular parent relationship detected');
      }
      currentParentId = current.parent.id;
    }
  }
}
