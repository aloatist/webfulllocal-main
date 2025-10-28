import { AuthTokenEntity } from './auth-token.entity';

export interface TokenPresenter {
  id: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    status: string;
  };
  createdAt: Date;
  expiresAt: Date;
  userAgent: string | null;
  ip: string | null;
  expired: boolean;
}

export function presentToken(token: AuthTokenEntity): TokenPresenter {
  return {
    id: token.id,
    user: {
      id: token.user.id,
      email: token.user.email,
      fullName: token.user.fullName,
      status: token.user.status,
    },
    createdAt: token.createdAt,
    expiresAt: token.expiresAt,
    userAgent: token.userAgent ?? null,
    ip: token.ip ?? null,
    expired: token.expiresAt <= new Date(),
  };
}
