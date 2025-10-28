import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PermissionEntity } from '../permissions/permission.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleQueryDto } from './dto/role-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async findAll(
    query: RoleQueryDto,
  ): Promise<{ data: RoleEntity[]; total: number }> {
    const { page = 1, limit = 20, search } = query;
    const where = search
      ? [{ name: ILike(`%${search}%`) }, { code: ILike(`%${search}%`) }]
      : undefined;

    const [data, total] = await this.repository.findAndCount({
      where,
      relations: { permissions: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<RoleEntity> {
    const role = await this.repository.findOne({
      where: { id },
      relations: { permissions: true },
    });
    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }
    return role;
  }

  async findByCode(code: string): Promise<RoleEntity | null> {
    return this.repository.findOne({ where: { code } });
  }

  async getByCodes(codes: string[]): Promise<RoleEntity[]> {
    if (!codes?.length) {
      return [];
    }
    return this.repository.find({
      where: codes.map((code) => ({ code })),
    });
  }

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const permissions = await this.resolvePermissions(dto.permissionCodes);
    const role = this.repository.create({ ...dto, permissions });
    return this.repository.save(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findById(id);
    if (dto.permissionCodes) {
      role.permissions = await this.resolvePermissions(dto.permissionCodes);
    }
    if (dto.name !== undefined) {
      role.name = dto.name;
    }
    if (dto.description !== undefined) {
      role.description = dto.description;
    }
    if (dto.code !== undefined) {
      role.code = dto.code;
    }
    return this.repository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findById(id);
    await this.repository.remove(role);
  }

  private async resolvePermissions(
    codes?: string[],
  ): Promise<PermissionEntity[]> {
    if (!codes?.length) {
      return [];
    }

    const permissions = await Promise.all(
      codes.map(async (code) => {
        const permission = await this.permissionsService.findByCode(code);
        if (!permission) {
          throw new NotFoundException(`Permission with code ${code} not found`);
        }
        return permission;
      }),
    );

    return permissions;
  }
}
