import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagQueryDto } from './dto/tag-query.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly repository: Repository<TagEntity>,
  ) {}

  async findAll(
    query: TagQueryDto,
  ): Promise<{ data: TagEntity[]; total: number }> {
    const { page = 1, limit = 20, search, type } = query;
    const conditions: Record<string, any>[] = [];

    if (search) {
      conditions.push({ label: ILike(`%${search}%`) });
      conditions.push({ slug: ILike(`%${search}%`) });
    }

    const [data, total] = await this.repository.findAndCount({
      where: conditions.length
        ? conditions.map((condition) => ({
            ...condition,
            ...(type ? { type } : {}),
          }))
        : type
          ? { type }
          : undefined,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<TagEntity> {
    const tag = await this.repository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag ${id} not found`);
    }
    return tag;
  }

  async create(dto: CreateTagDto): Promise<TagEntity> {
    const tag = this.repository.create({
      ...dto,
      type: dto.type ?? undefined,
    });
    return this.repository.save(tag);
  }

  async update(id: string, dto: UpdateTagDto): Promise<TagEntity> {
    const tag = await this.findById(id);
    Object.assign(tag, dto);
    return this.repository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findById(id);
    await this.repository.remove(tag);
  }
}
