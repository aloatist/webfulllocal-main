import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';
import { CheckinLogEntity } from './entities/checkin-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckinLogEntity])],
  controllers: [CheckinsController],
  providers: [CheckinsService],
  exports: [CheckinsService, TypeOrmModule],
})
export class CheckinsModule {}
