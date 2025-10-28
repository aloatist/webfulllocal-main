import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { DEFAULT_ACCESS_TOKEN_TTL, DEFAULT_JWT_SECRET } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET,
      signOptions: {
        expiresIn: Number(
          process.env.JWT_ACCESS_TOKEN_TTL ?? DEFAULT_ACCESS_TOKEN_TTL,
        ),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
