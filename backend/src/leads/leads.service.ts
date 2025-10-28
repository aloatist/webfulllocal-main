import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CustomersService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadEntity } from './lead.entity';
import { LeadStatus } from './lead-status.enum';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(LeadEntity)
    private readonly repository: Repository<LeadEntity>,
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(
    query: LeadQueryDto,
  ): Promise<{ data: LeadEntity[]; total: number }> {
    const { page = 1, limit = 20, search, status, topic, assignedToId } = query;

    const whereConditions: Record<string, any>[] = [];
    if (search) {
      whereConditions.push({ name: ILike(`%${search}%`) });
      whereConditions.push({ email: ILike(`%${search}%`) });
      whereConditions.push({ phone: ILike(`%${search}%`) });
    }

    const filters: Record<string, any> = {};
    if (status) {
      filters.status = status;
    }
    if (topic) {
      filters.topic = topic;
    }
    if (assignedToId) {
      filters.assignedTo = { id: assignedToId };
    }

    const [data, total] = await this.repository.findAndCount({
      where: whereConditions.length
        ? whereConditions.map((condition) => ({
            ...condition,
            ...filters,
          }))
        : filters,
      relations: { customer: true, assignedTo: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<LeadEntity> {
    const lead = await this.repository.findOne({
      where: { id },
      relations: { customer: true, assignedTo: true },
    });
    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }
    return lead;
  }

  async create(dto: CreateLeadDto): Promise<LeadEntity> {
    const customer = dto.customerId
      ? await this.customersService.findById(dto.customerId)
      : undefined;
    const assignedTo = dto.assignedToId
      ? await this.usersService.findById(dto.assignedToId)
      : undefined;

    const lead = this.repository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      message: dto.message,
      topic: dto.topic ?? undefined,
      customer: customer ?? null,
      assignedTo: assignedTo ?? null,
      metadata: dto.metadata,
      status: LeadStatus.NEW,
    });

    return this.repository.save(lead);
  }

  async update(id: string, dto: UpdateLeadDto): Promise<LeadEntity> {
    const lead = await this.findById(id);

    if (dto.customerId !== undefined) {
      lead.customer = dto.customerId
        ? await this.customersService.findById(dto.customerId)
        : null;
    }

    if (dto.assignedToId !== undefined) {
      lead.assignedTo = dto.assignedToId
        ? await this.usersService.findById(dto.assignedToId)
        : null;
    }

    if (dto.status !== undefined) {
      lead.status = dto.status;
    }

    if (dto.name !== undefined) {
      lead.name = dto.name;
    }
    if (dto.email !== undefined) {
      lead.email = dto.email;
    }
    if (dto.phone !== undefined) {
      lead.phone = dto.phone;
    }
    if (dto.message !== undefined) {
      lead.message = dto.message;
    }
    if (dto.topic !== undefined) {
      lead.topic = dto.topic;
    }
    if (dto.metadata !== undefined) {
      lead.metadata = dto.metadata;
    }

    return this.repository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findById(id);
    await this.repository.remove(lead);
  }

  async assignLead(id: string, userId: string): Promise<LeadEntity> {
    const lead = await this.findById(id);
    const user = await this.usersService.findById(userId);
    lead.assignedTo = user;
    return this.repository.save(lead);
  }

  async changeStatus(id: string, status: LeadStatus): Promise<LeadEntity> {
    const lead = await this.findById(id);
    lead.status = status;
    return this.repository.save(lead);
  }
}
