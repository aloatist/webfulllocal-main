import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { PropertyRoomEntity } from './property-room.entity';
import { PropertyEntity } from '../properties/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyRoomEntity, PropertyEntity])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
