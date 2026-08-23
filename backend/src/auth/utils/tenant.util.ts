import { ForbiddenException } from '@nestjs/common';

import { UserRole } from '../../generated/prisma/enums';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

export function getTenantId(user: AuthenticatedUser): string {
  if (user.role === UserRole.SUPER_ADMIN) {
    throw new ForbiddenException('SUPER_ADMIN tidak memiliki tenant');
  }

  if (!user.tenantId) {
    throw new ForbiddenException('Tenant tidak ditemukan');
  }

  return user.tenantId;
}
