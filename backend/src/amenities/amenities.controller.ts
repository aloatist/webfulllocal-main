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
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { AmenityQueryDto } from './dto/amenity-query.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { AmenitiesService } from './amenities.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get()
  @Permissions('catalog.read')
  findAll(@Query() query: AmenityQueryDto) {
    return this.amenitiesService.findAll(query);
  }

  @Get(':id')
  @Permissions('catalog.read')
  findOne(@Param('id') id: string) {
    return this.amenitiesService.findById(id);
  }

  @Post()
  @Permissions('catalog.write')
  create(@Body() dto: CreateAmenityDto) {
    return this.amenitiesService.create(dto);
  }

  @Patch(':id')
  @Permissions('catalog.write')
  update(@Param('id') id: string, @Body() dto: UpdateAmenityDto) {
    return this.amenitiesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('catalog.write')
  remove(@Param('id') id: string) {
    return this.amenitiesService.remove(id);
  }
}
