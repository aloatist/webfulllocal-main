import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AmenitiesController } from './amenities.controller';
import { AmenityEntity } from './amenity.entity';
import { AmenitiesService } from './amenities.service';

@Module({
  imports: [TypeOrmModule.forFeature([AmenityEntity])],
  controllers: [AmenitiesController],
  providers: [AmenitiesService, PermissionsGuard],
  exports: [AmenitiesService, TypeOrmModule],
})
export class AmenitiesModule {}
