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
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { presentUser } from './user.presenter';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('user.read')
  async findAll(@Query() query: UserQueryDto) {
    const { data, total } = await this.usersService.findAll(query);
    return {
      data: data.map(presentUser),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('user.read')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return presentUser(user);
  }

  @Post()
  @Permissions('user.write')
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return presentUser(user);
  }

  @Patch(':id')
  @Permissions('user.write')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return presentUser(user);
  }

  @Delete(':id')
  @Permissions('user.write')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { success: true };
  }
}
