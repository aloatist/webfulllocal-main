import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PropertyEntity } from './property.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { TagEntity } from '../tags/tag.entity';
import { PropertyRoomEntity } from '../rooms/property-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyEntity,
      DestinationEntity,
      TagEntity,
      PropertyRoomEntity,
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
