import { UserRole } from '../../generated/prisma/enums';

export interface AuthenticatedUser {
  id: string;
  userId: string;
  tenantId: string | null;
  role: UserRole;
}
