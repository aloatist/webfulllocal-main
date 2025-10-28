import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { RoomsService } from './rooms.service';
import { RoomQueryDto } from './dto/room-query.dto';
import { presentRoom } from './room.presenter';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @Permissions('room.read')
  async findAll(@Query() query: RoomQueryDto) {
    const { data, total } = await this.roomsService.findAll(query);
    return {
      data: data.map(presentRoom),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('room.read')
  async findOne(@Param('id') id: string) {
    const room = await this.roomsService.findById(id);
    return presentRoom(room);
  }

  @Post()
  @Permissions('room.write')
  async create(@Body() dto: CreateRoomDto) {
    const room = await this.roomsService.create(dto);
    return presentRoom(room);
  }

  @Patch(':id')
  @Permissions('room.write')
  async update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    const room = await this.roomsService.update(id, dto);
    return presentRoom(room);
  }

  @Delete(':id')
  @Permissions('room.write')
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
    return { success: true };
  }
}
