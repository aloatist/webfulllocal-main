import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DEFAULT_JWT_SECRET } from '../auth.constants';
import { UsersService } from '../../users/users.service';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET,
    });
  }

  async validate(payload: {
    sub: string;
    email?: string;
  }): Promise<RequestUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    const permissionSet = new Set<string>();
    const roles =
      user.roles?.map((role) => ({
        id: role.id,
        code: role.code,
        name: role.name,
        permissions: role.permissions ?? [],
      })) ?? [];

    roles.forEach((role) =>
      role.permissions.forEach((permission) =>
        permissionSet.add(permission.code),
      ),
    );

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      roles: roles.map(({ permissions: _permissions, ...rest }) => rest),
      permissions: Array.from(permissionSet),
    };
  }
}
