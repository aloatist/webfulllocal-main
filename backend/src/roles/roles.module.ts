import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RoleEntity } from './role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, PermissionsGuard],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
