import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ParticipantsModule } from '../participants/participants.module';
import { CheckinsModule } from '../checkins/checkins.module';

@Module({
  imports: [ParticipantsModule, CheckinsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
