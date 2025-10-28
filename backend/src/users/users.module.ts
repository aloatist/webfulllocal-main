import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, PermissionsGuard],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
