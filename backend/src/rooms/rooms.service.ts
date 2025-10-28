import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyRoomEntity } from './property-room.entity';
import { PropertyEntity } from '../properties/property.entity';
import { RoomQueryDto } from './dto/room-query.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(PropertyRoomEntity)
    private readonly repository: Repository<PropertyRoomEntity>,
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
  ) {}

  async findAll(
    query: RoomQueryDto,
  ): Promise<{ data: PropertyRoomEntity[]; total: number }> {
    const { page = 1, limit = 20, propertyId, status } = query;

    const [data, total] = await this.repository.findAndCount({
      where: {
        ...(propertyId ? { property: { id: propertyId } } : {}),
        ...(status ? { status } : {}),
      },
      relations: { property: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<PropertyRoomEntity> {
    const room = await this.repository.findOne({
      where: { id },
      relations: { property: true },
    });
    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }
    return room;
  }

  async create(dto: CreateRoomDto): Promise<PropertyRoomEntity> {
    const property = await this.propertyRepository.findOne({
      where: { id: dto.propertyId },
    });
    if (!property) {
      throw new NotFoundException(`Property ${dto.propertyId} not found`);
    }

    const {
      propertyId,
      basePrice,
      extraPersonFee,
      inventoryAvailable,
      inventoryTotal,
      ...rest
    } = dto;

    const room = this.repository.create({
      ...rest,
      property,
      basePrice: basePrice.toFixed(2),
      extraPersonFee:
        extraPersonFee !== undefined ? extraPersonFee.toFixed(2) : null,
      inventoryTotal: inventoryTotal ?? 0,
      inventoryAvailable: inventoryAvailable ?? inventoryTotal ?? 0,
    });

    return this.repository.save(room);
  }

  async update(id: string, dto: UpdateRoomDto): Promise<PropertyRoomEntity> {
    const room = await this.findById(id);

    if (dto.propertyId !== undefined) {
      const property = await this.propertyRepository.findOne({
        where: { id: dto.propertyId },
      });
      if (!property) {
        throw new NotFoundException(`Property ${dto.propertyId} not found`);
      }
      room.property = property;
    }

    const { propertyId, basePrice, extraPersonFee, ...rest } = dto;

    if (basePrice !== undefined) {
      room.basePrice = basePrice.toFixed(2);
    }
    if (extraPersonFee !== undefined) {
      room.extraPersonFee = extraPersonFee.toFixed(2);
    }

    Object.assign(room, rest);

    return this.repository.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findById(id);
    await this.repository.remove(room);
  }
}
