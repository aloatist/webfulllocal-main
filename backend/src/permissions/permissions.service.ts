import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly repository: Repository<PermissionEntity>,
  ) {}

  async findAll(): Promise<PermissionEntity[]> {
    return this.repository.find({ order: { code: 'ASC' } });
  }

  async findByCode(code: string): Promise<PermissionEntity | null> {
    return this.repository.findOne({ where: { code } });
  }

  async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const permission = this.repository.create(dto);
    return this.repository.save(permission);
  }

  async update(
    id: string,
    dto: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.repository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission ${id} not found`);
    }

    Object.assign(permission, dto);
    return this.repository.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.repository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission ${id} not found`);
    }

    await this.repository.remove(permission);
  }
}
