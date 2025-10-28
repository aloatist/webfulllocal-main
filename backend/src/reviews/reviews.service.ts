import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ReviewEntity, ReviewStatus } from './review.entity';
import { ReviewQueryDto } from './dto/review-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repository: Repository<ReviewEntity>,
  ) {}

  async findAll(
    query: ReviewQueryDto,
  ): Promise<{ data: ReviewEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      targetType,
      targetId,
      status,
    } = query;

    const where: Record<string, any>[] = [];
    if (search) {
      where.push({ targetName: ILike(`%${search}%`) });
      where.push({ authorName: ILike(`%${search}%`) });
      where.push({ authorEmail: ILike(`%${search}%`) });
      where.push({ body: ILike(`%${search}%`) });
      where.push({ title: ILike(`%${search}%`) });
    }

    const filters = {
      ...(targetType ? { targetType } : {}),
      ...(targetId ? { targetId } : {}),
      ...(status ? { status } : {}),
    };

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({ ...condition, ...filters }))
        : filters,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<ReviewEntity> {
    const review = await this.repository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    return review;
  }

  async create(dto: CreateReviewDto): Promise<ReviewEntity> {
    const review = this.repository.create({
      ...dto,
      status: dto.status ?? ReviewStatus.PENDING,
    });
    return this.repository.save(review);
  }

  async update(id: string, dto: UpdateReviewDto): Promise<ReviewEntity> {
    const review = await this.findById(id);

    if (dto.status && dto.status !== review.status) {
      review.status = dto.status;
      review.moderatedAt = new Date();
    }

    if (dto.moderationNotes !== undefined) {
      review.moderationNotes = dto.moderationNotes ?? null;
    }

    if (dto.tags !== undefined) {
      review.tags = dto.tags ?? [];
    }

    const { status, moderationNotes, tags, ...rest } = dto;
    Object.assign(review, rest);

    return this.repository.save(review);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findById(id);
    await this.repository.remove(review);
  }
}
