import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { AuthTokenEntity } from './auth-token.entity';

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? 'refresh-secret';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(AuthTokenEntity)
    private readonly repository: Repository<AuthTokenEntity>,
  ) {}

  async createToken(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    userAgent?: string,
    ip?: string,
  ): Promise<AuthTokenEntity> {
    const refreshTokenHash = this.hashToken(refreshToken);

    const token = this.repository.create({
      user: { id: userId } as any,
      refreshTokenHash,
      expiresAt,
      userAgent,
      ip,
    });
    return this.repository.save(token);
  }

  async findValidToken(refreshToken: string): Promise<AuthTokenEntity | null> {
    const refreshTokenHash = this.hashToken(refreshToken);
    const token = await this.repository.findOne({
      where: { refreshTokenHash },
      relations: { user: true },
    });

    if (!token) {
      return null;
    }

    if (token.expiresAt <= new Date()) {
      await this.repository.remove(token);
      return null;
    }

    return token;
  }

  async revokeUserTokens(userId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('user_id = :userId', { userId })
      .execute();
  }

  async pruneExpiredTokens(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }

  async findAll(): Promise<AuthTokenEntity[]> {
    return this.repository.find({
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<AuthTokenEntity[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const token = await this.repository.findOne({ where: { id } });
    if (!token) {
      throw new NotFoundException(`Token ${id} not found`);
    }
    await this.repository.remove(token);
  }

  private hashToken(token: string): string {
    return createHash('sha256')
      .update(`${token}.${REFRESH_TOKEN_SECRET}`)
      .digest('hex');
  }
}
