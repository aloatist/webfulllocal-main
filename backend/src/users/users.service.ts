import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { UserStatus } from '../common/enums/user-status.enum';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserEntity } from './user.entity';

const PASSWORD_SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(
    query: UserQueryDto,
  ): Promise<{ data: UserEntity[]; total: number }> {
    const { page = 1, limit = 20, search, status } = query;

    const where: Record<string, any>[] = [];
    if (search) {
      where.push({ fullName: ILike(`%${search}%`) });
      where.push({ email: ILike(`%${search}%`) });
    }

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({
            ...condition,
            ...(status ? { status } : {}),
          }))
        : status
          ? { status }
          : undefined,
      relations: { roles: { permissions: true } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { id },
      relations: { roles: { permissions: true } },
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
      relations: { roles: { permissions: true } },
    });
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const roles = await this.rolesService.getByCodes(dto.roleCodes ?? []);
    const passwordHash = await this.hashPassword(dto.password);
    const user = this.repository.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      status: dto.status ?? UserStatus.PENDING,
      roles,
    });

    return this.repository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(id);

    if (dto.email !== undefined) {
      user.email = dto.email;
    }
    if (dto.fullName !== undefined) {
      user.fullName = dto.fullName;
    }
    if (dto.status !== undefined) {
      user.status = dto.status;
    }
    if (dto.roleCodes !== undefined) {
      user.roles = await this.rolesService.getByCodes(dto.roleCodes);
    }
    if (dto.password) {
      user.passwordHash = await this.hashPassword(dto.password);
    }

    return this.repository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.repository.remove(user);
  }

  async setLastLogin(userId: string): Promise<void> {
    await this.repository.update(userId, { lastLoginAt: new Date() });
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }
}
