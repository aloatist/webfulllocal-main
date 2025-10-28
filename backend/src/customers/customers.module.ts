import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CustomerEntity } from './customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomersController],
  providers: [CustomersService, PermissionsGuard],
  exports: [CustomersService, TypeOrmModule],
})
export class CustomersModule {}
