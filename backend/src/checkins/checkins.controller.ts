import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CheckinsService } from './checkins.service';
import { ScanCheckinDto } from './dto/scan-checkin.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  @Permissions('attendance.checkin.scan')
  process(@Body() dto: ScanCheckinDto) {
    return this.checkinsService.processScan(dto);
  }

  @Get('recent')
  @Permissions('attendance.reports.read')
  recent(@Query('limit') limit = 20) {
    const parsed = Number(limit);
    const safeLimit =
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 100) : 20;
    return this.checkinsService.findRecent(safeLimit);
  }
}
