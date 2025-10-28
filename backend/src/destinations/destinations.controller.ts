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
import { DestinationsService } from './destinations.service';
import { DestinationQueryDto } from './dto/destination-query.dto';
import { presentDestination } from './destination.presenter';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  @Permissions('destination.read')
  async findAll(@Query() query: DestinationQueryDto) {
    const { data, total } = await this.destinationsService.findAll(query);
    return {
      data: data.map(presentDestination),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('destination.read')
  async findOne(@Param('id') id: string) {
    const destination = await this.destinationsService.findById(id);
    return presentDestination(destination);
  }

  @Post()
  @Permissions('destination.write')
  async create(@Body() dto: CreateDestinationDto) {
    const destination = await this.destinationsService.create(dto);
    return presentDestination(destination);
  }

  @Patch(':id')
  @Permissions('destination.write')
  async update(@Param('id') id: string, @Body() dto: UpdateDestinationDto) {
    const destination = await this.destinationsService.update(id, dto);
    return presentDestination(destination);
  }

  @Delete(':id')
  @Permissions('destination.write')
  async remove(@Param('id') id: string) {
    await this.destinationsService.remove(id);
    return { success: true };
  }
}
