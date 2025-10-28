import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { LocationsController } from './locations.controller';
import { LocationEntity } from './location.entity';
import { LocationsService } from './locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  controllers: [LocationsController],
  providers: [LocationsService, PermissionsGuard],
  exports: [LocationsService, TypeOrmModule],
})
export class LocationsModule {}
