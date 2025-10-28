import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';
import { LeadEntity } from './lead.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeadEntity]),
    CustomersModule,
    UsersModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService, PermissionsGuard],
  exports: [LeadsService, TypeOrmModule],
})
export class LeadsModule {}
