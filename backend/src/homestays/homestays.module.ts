import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomestaysController } from './homestays.controller';
import { HomestaysService } from './homestays.service';
import { HomestayEntity } from './homestay.entity';
import { HomestayRoomEntity } from './homestay-room.entity';
import { HomestayAvailabilityEntity } from './homestay-availability.entity';
import { HomestayPricingRuleEntity } from './homestay-pricing-rule.entity';
import { HomestayBookingEntity } from './homestay-booking.entity';
import { HomestayReviewEntity } from './homestay-review.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { TagEntity } from '../tags/tag.entity';
import { UserEntity } from '../users/user.entity';
import { HomestayCalendarService } from './homestay-calendar.service';
import { HomestayPricingService } from './homestay-pricing.service';
import { HomestayMediaService } from './homestay-media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HomestayEntity,
      HomestayRoomEntity,
      HomestayAvailabilityEntity,
      HomestayPricingRuleEntity,
      HomestayBookingEntity,
      HomestayReviewEntity,
      DestinationEntity,
      TagEntity,
      UserEntity,
    ]),
  ],
  controllers: [HomestaysController],
  providers: [
    HomestaysService,
    HomestayCalendarService,
    HomestayPricingService,
    HomestayMediaService,
  ],
  exports: [
    HomestaysService,
    HomestayCalendarService,
    HomestayPricingService,
    HomestayMediaService,
  ],
})
export class HomestaysModule {}
