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
import { RestaurantsService } from './restaurants.service';
import { RestaurantQueryDto } from './dto/restaurant-query.dto';
import { presentRestaurant } from './restaurant.presenter';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @Permissions('restaurant.read')
  async findAll(@Query() query: RestaurantQueryDto) {
    const { data, total } = await this.restaurantsService.findAll(query);
    return {
      data: data.map(presentRestaurant),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('restaurant.read')
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.findById(id);
    return presentRestaurant(restaurant);
  }

  @Post()
  @Permissions('restaurant.write')
  async create(@Body() dto: CreateRestaurantDto) {
    const restaurant = await this.restaurantsService.create(dto);
    return presentRestaurant(restaurant);
  }

  @Patch(':id')
  @Permissions('restaurant.write')
  async update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantsService.update(id, dto);
    return presentRestaurant(restaurant);
  }

  @Delete(':id')
  @Permissions('restaurant.write')
  async remove(@Param('id') id: string) {
    await this.restaurantsService.remove(id);
    return { success: true };
  }
}
