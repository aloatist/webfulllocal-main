import { Module } from '@nestjs/common';
import { PermissionsModule } from '../../permissions/permissions.module';
import { RolesModule } from '../../roles/roles.module';
import { UsersModule } from '../../users/users.module';
import { ParticipantsModule } from '../../participants/participants.module';
import { InitialDataService } from './initial-data.service';

@Module({
  imports: [PermissionsModule, RolesModule, UsersModule, ParticipantsModule],
  providers: [InitialDataService],
})
export class SeedModule {}
