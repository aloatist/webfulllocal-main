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
import { PromotionsService } from './promotions.service';
import { PromotionQueryDto } from './dto/promotion-query.dto';
import { presentPromotion } from './promotion.presenter';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @Permissions('promotion.read')
  async findAll(@Query() query: PromotionQueryDto) {
    const { data, total } = await this.promotionsService.findAll(query);
    return {
      data: data.map(presentPromotion),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('promotion.read')
  async findOne(@Param('id') id: string) {
    const promotion = await this.promotionsService.findById(id);
    return presentPromotion(promotion);
  }

  @Post()
  @Permissions('promotion.write')
  async create(@Body() dto: CreatePromotionDto) {
    const promotion = await this.promotionsService.create(dto);
    return presentPromotion(promotion);
  }

  @Patch(':id')
  @Permissions('promotion.write')
  async update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    const promotion = await this.promotionsService.update(id, dto);
    return presentPromotion(promotion);
  }

  @Delete(':id')
  @Permissions('promotion.write')
  async remove(@Param('id') id: string) {
    await this.promotionsService.remove(id);
    return { success: true };
  }
}
