import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { UserRole } from '../../generated/prisma/enums';

import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User tidak memiliki akses');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!requiredRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException(
        'Anda tidak memiliki izin untuk mengakses aksi ini',
      );
    }

    return true;
  }
}
