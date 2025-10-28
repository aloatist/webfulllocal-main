import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PermissionsService } from '../../permissions/permissions.service';
import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../../users/users.service';
import { ParticipantsService } from '../../participants/participants.service';
import {
  DEFAULT_ADMIN,
  DEFAULT_PERMISSIONS,
  DEFAULT_ROLES,
} from './seed.constants';

@Injectable()
export class InitialDataService implements OnModuleInit {
  private readonly logger = new Logger(InitialDataService.name);

  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly participantsService: ParticipantsService,
  ) {}

  async onModuleInit() {
    await this.ensurePermissions();
    await this.ensureRoles();
    await this.ensureAdminUser();
    await this.ensureSampleParticipants();
  }

  private async ensurePermissions() {
    for (const permission of DEFAULT_PERMISSIONS) {
      const existing = await this.permissionsService.findByCode(
        permission.code,
      );
      if (!existing) {
        await this.permissionsService.create(permission);
        this.logger.log(`Seeded permission ${permission.code}`);
      }
    }
  }

  private async ensureRoles() {
    for (const role of DEFAULT_ROLES) {
      const existing = await this.rolesService.findByCode(role.code);
      if (!existing) {
        await this.rolesService.create({
          code: role.code,
          name: role.name,
          description: role.description,
          permissionCodes: role.permissions,
        });
        this.logger.log(`Seeded role ${role.code}`);
      }
    }
  }

  private async ensureAdminUser() {
    const existing = await this.usersService.findByEmail(DEFAULT_ADMIN.email);
    if (!existing) {
      await this.usersService.create({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password,
        fullName: DEFAULT_ADMIN.fullName,
        roleCodes: ['admin'],
      });
      this.logger.log(`Seeded admin user ${DEFAULT_ADMIN.email}`);
    }
  }

  private async ensureSampleParticipants() {
    const desiredCount = Number(process.env.SEED_PARTICIPANTS_COUNT ?? 50);
    if (desiredCount <= 0) {
      return;
    }

    const stats = await this.participantsService.stats();
    if (stats.total >= desiredCount) {
      return;
    }

    const toCreate = desiredCount - stats.total;
    for (let index = 0; index < toCreate; index++) {
      const number = stats.total + index + 1;
      const code = `ATT${number.toString().padStart(4, '0')}`;
      const fullName = `Khách tham dự ${number}`;

      try {
        await this.participantsService.create({
          fullName,
          code,
        });
      } catch (error) {
        this.logger.error(
          `Failed to seed participant ${fullName}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }

    this.logger.log(
      `Seeded ${toCreate} sample participants for attendance testing`,
    );
  }
}
