import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { TagEntity } from '../tags/tag.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  async findAll(
    query: ProductQueryDto,
  ): Promise<{ data: ProductEntity[]; total: number }> {
    const { page = 1, limit = 20, search, status, type, tagId } = query;

    const where: Record<string, any>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ slug: ILike(`%${search}%`) });
      where.push({ summary: ILike(`%${search}%`) });
      where.push({ sku: ILike(`%${search}%`) });
    }

    const filters: Record<string, any> = {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
    };

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({
            ...condition,
            ...filters,
            ...(tagId ? { tags: { id: tagId } } : {}),
          }))
        : {
            ...filters,
            ...(tagId ? { tags: { id: tagId } } : {}),
          },
      relations: {
        tags: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<ProductEntity> {
    const product = await this.repository.findOne({
      where: { id },
      relations: { tags: true },
    });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const slugExists = await this.repository.exist({
      where: { slug: dto.slug },
    });
    if (slugExists) {
      throw new BadRequestException('Slug already exists');
    }

    if (dto.sku) {
      const skuExists = await this.repository.exist({
        where: { sku: dto.sku },
      });
      if (skuExists) {
        throw new BadRequestException('SKU already exists');
      }
    }

    const tagIds = dto.tagIds ?? [];

    const tags = tagIds.length
      ? await this.tagsRepository.find({ where: { id: In(tagIds) } })
      : [];

    const price = dto.price;
    const compareAtPrice = dto.compareAtPrice;
    const availableFrom = dto.availableFrom;
    const availableTo = dto.availableTo;
    const {
      tagIds: _tagIds,
      price: _price,
      compareAtPrice: _compareAtPrice,
      availableFrom: _availableFrom,
      availableTo: _availableTo,
      ...rest
    } = dto;

    const product = this.repository.create({
      ...rest,
      price: price !== undefined ? price.toFixed(2) : null,
      compareAtPrice:
        compareAtPrice !== undefined ? compareAtPrice.toFixed(2) : null,
      availableFrom: availableFrom ? new Date(availableFrom) : null,
      availableTo: availableTo ? new Date(availableTo) : null,
      tags,
    });

    if (dto.stockQuantity !== undefined) {
      product.stockQuantity = dto.stockQuantity;
    }

    return this.repository.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findById(id);

    if (dto.slug && dto.slug !== product.slug) {
      const slugExists = await this.repository.exist({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    if (dto.sku && dto.sku !== product.sku) {
      const skuExists = await this.repository.exist({
        where: { sku: dto.sku },
      });
      if (skuExists) {
        throw new BadRequestException('SKU already exists');
      }
    }

    if (dto.tagIds !== undefined) {
      product.tags = dto.tagIds.length
        ? await this.tagsRepository.find({ where: { id: In(dto.tagIds) } })
        : [];
    }

    if (dto.price !== undefined) {
      product.price = dto.price.toFixed(2);
    }

    if (dto.compareAtPrice !== undefined) {
      product.compareAtPrice = dto.compareAtPrice.toFixed(2);
    }

    if (dto.availableFrom !== undefined) {
      product.availableFrom = dto.availableFrom
        ? new Date(dto.availableFrom)
        : null;
    }

    if (dto.availableTo !== undefined) {
      product.availableTo = dto.availableTo ? new Date(dto.availableTo) : null;
    }

    if (dto.stockQuantity !== undefined) {
      product.stockQuantity = dto.stockQuantity;
    }

    const {
      tagIds: __tagIds,
      price: __price,
      compareAtPrice: __compareAtPrice,
      availableFrom: __availableFrom,
      availableTo: __availableTo,
      ...rest
    } = dto;

    Object.assign(product, rest);

    return this.repository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    await this.repository.remove(product);
  }
}
