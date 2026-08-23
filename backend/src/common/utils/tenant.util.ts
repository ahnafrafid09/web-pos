// src/common/utils/tenant.util.ts
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

export function getTenantId(currentUser: AuthenticatedUser): string {
  if (!currentUser.tenantId) {
    throw new ForbiddenException('User tidak memiliki tenant');
  }

  return currentUser.tenantId;
}
