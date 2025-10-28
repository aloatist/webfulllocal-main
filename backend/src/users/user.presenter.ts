import { UserEntity } from './user.entity';

export interface UserPresenter {
  id: string;
  email: string;
  fullName: string;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roles: {
    id: string;
    code: string;
    name: string;
    permissions: { id: string; code: string; name: string }[];
  }[];
}

export function presentUser(user: UserEntity): UserPresenter {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles:
      user.roles?.map((role) => ({
        id: role.id,
        code: role.code,
        name: role.name,
        permissions:
          role.permissions?.map((permission) => ({
            id: permission.id,
            code: permission.code,
            name: permission.name,
          })) ?? [],
      })) ?? [],
  };
}
