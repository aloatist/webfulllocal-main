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
import { ReviewsService } from './reviews.service';
import { ReviewQueryDto } from './dto/review-query.dto';
import { presentReview } from './review.presenter';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Permissions('review.read')
  async findAll(@Query() query: ReviewQueryDto) {
    const { data, total } = await this.reviewsService.findAll(query);
    return {
      data: data.map(presentReview),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('review.read')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findById(id);
    return presentReview(review);
  }

  @Post()
  @Permissions('review.write')
  async create(@Body() dto: CreateReviewDto) {
    const review = await this.reviewsService.create(dto);
    return presentReview(review);
  }

  @Patch(':id')
  @Permissions('review.write')
  async update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    const review = await this.reviewsService.update(id, dto);
    return presentReview(review);
  }

  @Delete(':id')
  @Permissions('review.write')
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
    return { success: true };
  }
}
