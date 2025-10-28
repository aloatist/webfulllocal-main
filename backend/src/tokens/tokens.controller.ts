import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { presentToken } from './token.presenter';
import { TokensService } from './tokens.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  @Permissions('token.read')
  async list() {
    const tokens = await this.tokensService.findAll();
    return tokens.map(presentToken);
  }

  @Get('user/:userId')
  @Permissions('token.read')
  async listByUser(@Param('userId') userId: string) {
    const tokens = await this.tokensService.findByUser(userId);
    return tokens.map(presentToken);
  }

  @Delete(':id')
  @Permissions('token.write')
  async revoke(@Param('id') id: string) {
    await this.tokensService.remove(id);
    return { success: true };
  }
}
