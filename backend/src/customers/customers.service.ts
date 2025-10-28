import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async findAll(
    query: CustomerQueryDto,
  ): Promise<{ data: CustomerEntity[]; total: number }> {
    const { page = 1, limit = 20, search, source, tag } = query;

    const whereConditions: Record<string, any>[] = [];

    if (search) {
      whereConditions.push({ fullName: ILike(`%${search}%`) });
      whereConditions.push({ email: ILike(`%${search}%`) });
      whereConditions.push({ phone: ILike(`%${search}%`) });
    }

    const baseFilter: Record<string, any> = {};
    if (source) {
      baseFilter.source = source;
    }

    const [data, total] = await this.repository.findAndCount({
      where: whereConditions.length
        ? whereConditions.map((condition) => ({
            ...condition,
            ...baseFilter,
            ...(tag ? { tags: ILike(`%${tag}%`) } : {}),
          }))
        : {
            ...baseFilter,
            ...(tag ? { tags: ILike(`%${tag}%`) } : {}),
          },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<CustomerEntity> {
    const customer = await this.repository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    return customer;
  }

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = this.repository.create({
      ...dto,
      tags: dto.tags?.length ? dto.tags : null,
    });
    return this.repository.save(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.findById(id);

    if (dto.fullName !== undefined) {
      customer.fullName = dto.fullName;
    }
    if (dto.email !== undefined) {
      customer.email = dto.email;
    }
    if (dto.phone !== undefined) {
      customer.phone = dto.phone;
    }
    if (dto.country !== undefined) {
      customer.country = dto.country;
    }
    if (dto.preferredLanguage !== undefined) {
      customer.preferredLanguage = dto.preferredLanguage;
    }
    if (dto.notes !== undefined) {
      customer.notes = dto.notes;
    }
    if (dto.source !== undefined) {
      customer.source = dto.source;
    }
    if (dto.tags !== undefined) {
      customer.tags = dto.tags?.length ? dto.tags : null;
    }

    return this.repository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findById(id);
    await this.repository.remove(customer);
  }
}
