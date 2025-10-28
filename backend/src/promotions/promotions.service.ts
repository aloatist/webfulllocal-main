import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromotionEntity } from './promotion.entity';
import { PromotionQueryDto } from './dto/promotion-query.dto';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly repository: Repository<PromotionEntity>,
  ) {}

  async findAll(
    query: PromotionQueryDto,
  ): Promise<{ data: PromotionEntity[]; total: number }> {
    const { page = 1, limit = 20, search, type, status } = query;
    const qb = this.repository
      .createQueryBuilder('promotion')
      .orderBy('promotion.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(LOWER(promotion.code) LIKE LOWER(:search) OR LOWER(promotion.title) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (type) {
      qb.andWhere('promotion.type = :type', { type });
    }

    if (status) {
      const now = new Date();
      if (status === 'active') {
        qb.andWhere(
          'promotion.isActive = :active AND (promotion.startDate IS NULL OR promotion.startDate <= :now) AND (promotion.endDate IS NULL OR promotion.endDate >= :now)',
          { active: true, now },
        );
      } else if (status === 'upcoming') {
        qb.andWhere(
          'promotion.isActive = :active AND promotion.startDate IS NOT NULL AND promotion.startDate > :now',
          { active: true, now },
        );
      } else if (status === 'expired') {
        qb.andWhere(
          'promotion.isActive = :inactive OR (promotion.endDate IS NOT NULL AND promotion.endDate < :now)',
          { inactive: false, now },
        );
      }
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findById(id: string): Promise<PromotionEntity> {
    const promotion = await this.repository.findOne({ where: { id } });
    if (!promotion) {
      throw new NotFoundException(`Promotion ${id} not found`);
    }
    return promotion;
  }

  async create(dto: CreatePromotionDto): Promise<PromotionEntity> {
    const codeExists = await this.repository.exist({
      where: { code: dto.code },
    });
    if (codeExists) {
      throw new BadRequestException('Promotion code already exists');
    }

    const promotion = this.repository.create({
      ...dto,
      discountValue: dto.discountValue.toFixed(2),
      discountCurrency: dto.discountCurrency ?? 'VND',
      minSpend: dto.minSpend !== undefined ? dto.minSpend.toFixed(2) : null,
      maxDiscount:
        dto.maxDiscount !== undefined ? dto.maxDiscount.toFixed(2) : null,
      usageLimit: dto.usageLimit ?? null,
      perCustomerLimit: dto.perCustomerLimit ?? null,
      isActive: dto.isActive ?? true,
    });

    return this.repository.save(promotion);
  }

  async update(id: string, dto: UpdatePromotionDto): Promise<PromotionEntity> {
    const promotion = await this.findById(id);

    if (dto.code && dto.code !== promotion.code) {
      const codeExists = await this.repository.exist({
        where: { code: dto.code },
      });
      if (codeExists) {
        throw new BadRequestException('Promotion code already exists');
      }
    }

    if (dto.discountValue !== undefined) {
      promotion.discountValue = dto.discountValue.toFixed(2);
    }

    if (dto.discountCurrency !== undefined) {
      promotion.discountCurrency = dto.discountCurrency;
    }

    if (dto.minSpend !== undefined) {
      promotion.minSpend =
        dto.minSpend !== null ? dto.minSpend.toFixed(2) : null;
    }

    if (dto.maxDiscount !== undefined) {
      promotion.maxDiscount =
        dto.maxDiscount !== null ? dto.maxDiscount.toFixed(2) : null;
    }

    if (dto.usageLimit !== undefined) {
      promotion.usageLimit = dto.usageLimit;
    }

    if (dto.perCustomerLimit !== undefined) {
      promotion.perCustomerLimit = dto.perCustomerLimit;
    }

    const { discountValue, discountCurrency, minSpend, maxDiscount, ...rest } =
      dto;

    Object.assign(promotion, rest);

    return this.repository.save(promotion);
  }

  async remove(id: string): Promise<void> {
    const promotion = await this.findById(id);
    await this.repository.remove(promotion);
  }
}
