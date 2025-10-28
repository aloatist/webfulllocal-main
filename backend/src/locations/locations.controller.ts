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
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationQueryDto } from './dto/location-query.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @Permissions('catalog.read')
  findAll(@Query() query: LocationQueryDto) {
    return this.locationsService.findAll(query);
  }

  @Get(':id')
  @Permissions('catalog.read')
  findOne(@Param('id') id: string) {
    return this.locationsService.findById(id);
  }

  @Get(':id/children')
  @Permissions('catalog.read')
  findChildren(@Param('id') id: string) {
    return this.locationsService.getChildren(id);
  }

  @Post()
  @Permissions('catalog.write')
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Patch(':id')
  @Permissions('catalog.write')
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.locationsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('catalog.write')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}
