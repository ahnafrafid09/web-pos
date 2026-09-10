import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ModuleAccessService } from './module-access.service';
import { REQUIRED_MODULE_KEY } from '../decorators/require-module.decorator';
import { ModuleCode, UserRole } from '../../generated/prisma/enums';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleAccessService: ModuleAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Ambil module yang diwajibkan oleh
     * @RequireModule(...)
     */
    const requiredModule = this.reflector.getAllAndOverride<ModuleCode>(
      REQUIRED_MODULE_KEY,
      [context.getHandler(), context.getClass()],
    );

    /**
     * Kalau endpoint tidak menggunakan
     * @RequireModule(), izinkan.
     */
    if (!requiredModule) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    /**
     * Pastikan sudah login
     */
    if (!user) {
      throw new ForbiddenException('User tidak ditemukan');
    }

    /**
     * SUPER_ADMIN adalah platform administrator,
     * jadi tidak terikat module milik tenant.
     */
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    /**
     * User biasa harus mempunyai tenantId.
     */
    if (!user.tenantId) {
      throw new ForbiddenException('Tenant tidak ditemukan');
    }

    /**
     * Cek apakah tenant memiliki module tersebut.
     */
    const hasAccess = await this.moduleAccessService.hasAccess(
      user.tenantId,
      requiredModule,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        `Module ${requiredModule} tidak aktif untuk tenant ini`,
      );
    }

    return true;
  }
}
