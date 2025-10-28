import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { presentUser } from '../users/user.presenter';
import { TokensService } from '../tokens/tokens.service';
import {
  DEFAULT_ACCESS_TOKEN_TTL,
  DEFAULT_REFRESH_TOKEN_TTL,
} from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokens } from './interfaces/auth-tokens.interface';

@Injectable()
export class AuthService {
  private readonly accessTokenTtl: number;
  private readonly refreshTokenTtl: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenTtl = Number(
      process.env.JWT_ACCESS_TOKEN_TTL ?? DEFAULT_ACCESS_TOKEN_TTL,
    );
    this.refreshTokenTtl = Number(
      process.env.JWT_REFRESH_TOKEN_TTL ?? DEFAULT_REFRESH_TOKEN_TTL,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.tokensService.revokeUserTokens(user.id);

    const tokens = await this.issueTokens(
      user.id,
      user.email,
      dto.userAgent,
      dto.ip,
    );
    await this.usersService.setLastLogin(user.id);

    return {
      user: presentUser(user),
      tokens,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const token = await this.tokensService.findValidToken(dto.refreshToken);
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(token.user.id);

    await this.tokensService.revokeUserTokens(user.id);
    const tokens = await this.issueTokens(user.id, user.email);

    return {
      user: presentUser(user),
      tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.tokensService.revokeUserTokens(userId);
  }

  private async issueTokens(
    userId: string,
    email?: string,
    userAgent?: string,
    ip?: string,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenTtl,
    });

    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + this.refreshTokenTtl * 1000);

    await this.tokensService.createToken(
      userId,
      refreshToken,
      expiresAt,
      userAgent,
      ip,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenTtl,
    };
  }
}
