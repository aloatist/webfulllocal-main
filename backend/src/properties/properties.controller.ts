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
import { PropertiesService } from './properties.service';
import { PropertyQueryDto } from './dto/property-query.dto';
import { presentProperty } from './property.presenter';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @Permissions('property.read')
  async findAll(@Query() query: PropertyQueryDto) {
    const { data, total } = await this.propertiesService.findAll(query);
    return {
      data: data.map(presentProperty),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('property.read')
  async findOne(@Param('id') id: string) {
    const property = await this.propertiesService.findById(id);
    return presentProperty(property);
  }

  @Post()
  @Permissions('property.write')
  async create(@Body() dto: CreatePropertyDto) {
    const property = await this.propertiesService.create(dto);
    return presentProperty(property);
  }

  @Patch(':id')
  @Permissions('property.write')
  async update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    const property = await this.propertiesService.update(id, dto);
    return presentProperty(property);
  }

  @Delete(':id')
  @Permissions('property.write')
  async remove(@Param('id') id: string) {
    await this.propertiesService.remove(id);
    return { success: true };
  }
}
