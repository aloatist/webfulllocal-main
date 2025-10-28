import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { DashboardService, DashboardOverview } from './dashboard.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @Permissions('dashboard.read')
  async overview(): Promise<DashboardOverview> {
    return this.dashboardService.getOverview();
  }

  @Post('reset')
  @HttpCode(200)
  @Permissions('dashboard.reset')
  async reset() {
    await this.dashboardService.resetData();
    return { success: true };
  }
}
