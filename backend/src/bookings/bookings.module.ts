import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';
import { PropertyRoomEntity } from '../rooms/property-room.entity';
import { ExperienceEntity } from '../experiences/experience.entity';
import { RestaurantEntity } from '../restaurants/restaurant.entity';
import { CustomerEntity } from '../customers/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      DestinationEntity,
      PropertyEntity,
      PropertyRoomEntity,
      ExperienceEntity,
      RestaurantEntity,
      CustomerEntity,
    ]),
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
