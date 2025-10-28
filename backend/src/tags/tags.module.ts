import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TagsController } from './tags.controller';
import { TagEntity } from './tag.entity';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagsController],
  providers: [TagsService, PermissionsGuard],
  exports: [TagsService, TypeOrmModule],
})
export class TagsModule {}
