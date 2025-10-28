import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { HomestaysService } from './homestays.service';
import { HomestayQueryDto } from './dto/homestay-query.dto';
import { AdminCreateHomestayDto } from './dto/admin-create-homestay.dto';
import { AdminUpdateHomestayDto } from './dto/admin-update-homestay.dto';
import {
  presentHomestayAvailability,
  presentHomestayDetail,
  presentHomestayPricingRule,
  presentHomestayRoom,
  presentHomestaySummary,
} from './homestay.presenter';
import { CreateHomestayRoomDto } from './dto/create-homestay-room.dto';
import { UpdateHomestayRoomDto } from './dto/update-homestay-room.dto';
import { CreateHomestayAvailabilityDto } from './dto/create-homestay-availability.dto';
import { UpdateHomestayAvailabilityDto } from './dto/update-homestay-availability.dto';
import { CreateHomestayPricingRuleDto } from './dto/create-homestay-pricing-rule.dto';
import { UpdateHomestayPricingRuleDto } from './dto/update-homestay-pricing-rule.dto';
import { HomestayBulkActionDto } from './dto/homestay-bulk-action.dto';
import { CreateHomestayAvailabilityBulkDto } from './dto/create-homestay-availability-bulk.dto';
import { HomestayCalendarService } from './homestay-calendar.service';
import { HomestayCalendarQueryDto } from './dto/homestay-calendar-query.dto';
import { HomestayPricingService } from './homestay-pricing.service';
import { HomestayPricingQuoteDto } from './dto/homestay-pricing-quote.dto';
import { HomestayMediaService } from './homestay-media.service';
import { UpdateHomestayMediaDto } from './dto/update-homestay-media.dto';

type AuthenticatedRequest = Request & { user: RequestUser };

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('homestays')
export class HomestaysController {
  constructor(
    private readonly homestaysService: HomestaysService,
    private readonly homestayCalendarService: HomestayCalendarService,
    private readonly homestayPricingService: HomestayPricingService,
    private readonly homestayMediaService: HomestayMediaService,
  ) {}

  @Get()
  @Permissions('property.read')
  async findAll(@Query() query: HomestayQueryDto) {
    const { data, total } = await this.homestaysService.findAll(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: data.map(presentHomestaySummary),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  @Get('dashboard')
  @Permissions('property.read')
  async dashboard() {
    return this.homestaysService.getDashboardMetrics();
  }

  @Get('analytics')
  @Permissions('property.read')
  async analytics() {
    return this.homestaysService.getAnalytics();
  }

  @Get(':id/calendar')
  @Permissions('property.read')
  async calendar(
    @Param('id') id: string,
    @Query() query: HomestayCalendarQueryDto,
  ) {
    return this.homestayCalendarService.getCalendar(id, query);
  }

  @Get('export')
  @Permissions('property.read')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header(
    'Content-Disposition',
    'attachment; filename="homestays-export.csv"',
  )
  async export(@Query() query: HomestayQueryDto) {
    return this.homestaysService.exportHomestays(query);
  }

  @Post('bulk-actions/:actionId')
  @Permissions('property.write')
  async bulkAction(
    @Param('actionId') actionId: string,
    @Body() dto: HomestayBulkActionDto,
  ) {
    return this.homestaysService.processBulkAction(actionId, dto.ids);
  }

  @Get(':id')
  @Permissions('property.read')
  async findOne(@Param('id') id: string) {
    const homestay = await this.homestaysService.findById(id);
    return presentHomestayDetail(homestay);
  }

  @Post()
  @Permissions('property.write')
  async create(
    @Body() dto: AdminCreateHomestayDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { hostId, ...payload } = dto;
    const resolvedHostId = hostId ?? req.user.id;
    const homestay = await this.homestaysService.create(
      payload,
      resolvedHostId,
    );
    return presentHomestayDetail(homestay);
  }

  @Put(':id')
  @Permissions('property.write')
  async update(
    @Param('id') id: string,
    @Body() dto: AdminUpdateHomestayDto,
  ) {
    const { hostId, ...payload } = dto;
    const homestay = await this.homestaysService.update(
      id,
      payload,
      hostId,
    );
    return presentHomestayDetail(homestay);
  }

  @Post(':id/pricing/quote')
  @Permissions('property.read')
  async pricingQuote(
    @Param('id') id: string,
    @Body() dto: HomestayPricingQuoteDto,
  ) {
    return this.homestayPricingService.quote(id, dto);
  }

  @Delete(':id')
  @Permissions('property.write')
  async remove(@Param('id') id: string) {
    await this.homestaysService.remove(id);
    return { success: true };
  }

  // Rooms
  @Post(':id/rooms')
  @Permissions('property.write')
  async createRoom(
    @Param('id') homestayId: string,
    @Body() dto: CreateHomestayRoomDto,
  ) {
    const room = await this.homestaysService.createRoom(homestayId, dto);
    return presentHomestayRoom(room);
  }

  @Patch(':id/rooms/:roomId')
  @Permissions('property.write')
  async updateRoom(
    @Param('id') homestayId: string,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateHomestayRoomDto,
  ) {
    const room = await this.homestaysService.updateRoom(
      homestayId,
      roomId,
      dto,
    );
    return presentHomestayRoom(room);
  }

  @Delete(':id/rooms/:roomId')
  @Permissions('property.write')
  async removeRoom(
    @Param('id') homestayId: string,
    @Param('roomId') roomId: string,
  ) {
    await this.homestaysService.removeRoom(homestayId, roomId);
    return { success: true };
  }

  // Availability
  @Post(':id/availability')
  @Permissions('property.write')
  async createAvailability(
    @Param('id') homestayId: string,
    @Body() dto: CreateHomestayAvailabilityDto,
  ) {
    const availability = await this.homestaysService.createAvailability(
      homestayId,
      dto,
    );
    return presentHomestayAvailability(availability);
  }

  @Post(':id/availability/bulk')
  @Permissions('property.write')
  async createAvailabilityBulk(
    @Param('id') homestayId: string,
    @Body() dto: CreateHomestayAvailabilityBulkDto,
  ) {
    const items = await this.homestaysService.createAvailabilityBulk(
      homestayId,
      dto.items,
    );
    return items.map(presentHomestayAvailability);
  }

  @Patch(':id/availability/:availabilityId')
  @Permissions('property.write')
  async updateAvailability(
    @Param('id') homestayId: string,
    @Param('availabilityId') availabilityId: string,
    @Body() dto: UpdateHomestayAvailabilityDto,
  ) {
    const availability = await this.homestaysService.updateAvailability(
      homestayId,
      availabilityId,
      dto,
    );
    return presentHomestayAvailability(availability);
  }

  @Delete(':id/availability/:availabilityId')
  @Permissions('property.write')
  async removeAvailability(
    @Param('id') homestayId: string,
    @Param('availabilityId') availabilityId: string,
  ) {
    await this.homestaysService.removeAvailability(homestayId, availabilityId);
    return { success: true };
  }

  // Pricing rules
  @Post(':id/pricing-rules')
  @Permissions('property.write')
  async createPricingRule(
    @Param('id') homestayId: string,
    @Body() dto: CreateHomestayPricingRuleDto,
  ) {
    const rule = await this.homestaysService.createPricingRule(
      homestayId,
      dto,
    );
    return presentHomestayPricingRule(rule);
  }

  @Patch(':id/pricing-rules/:ruleId')
  @Permissions('property.write')
  async updatePricingRule(
    @Param('id') homestayId: string,
    @Param('ruleId') ruleId: string,
    @Body() dto: UpdateHomestayPricingRuleDto,
  ) {
    const rule = await this.homestaysService.updatePricingRule(
      homestayId,
      ruleId,
      dto,
    );
    return presentHomestayPricingRule(rule);
  }

  @Delete(':id/pricing-rules/:ruleId')
  @Permissions('property.write')
  async removePricingRule(
    @Param('id') homestayId: string,
    @Param('ruleId') ruleId: string,
  ) {
    await this.homestaysService.removePricingRule(homestayId, ruleId);
    return { success: true };
  }

  @Patch(':id/media')
  @Permissions('property.write')
  async updateMedia(
    @Param('id') id: string,
    @Body() dto: UpdateHomestayMediaDto,
  ) {
    const homestay = await this.homestayMediaService.updateMedia(id, dto);
    return presentHomestayDetail(homestay);
  }
}
