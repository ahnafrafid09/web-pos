import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { AuditLogAction } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

interface CreateAuditLogParams {
  tenantId?: string | null;
  userId?: string | null;

  action: AuditLogAction;
  module: string;

  entityType: string;
  entityId?: string | null;

  description?: string;

  oldData?: Prisma.InputJsonValue | null;
  newData?: Prisma.InputJsonValue | null;

  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateAuditLogParams) {
    return this.prisma.auditLog.create({
      data: {
        tenantId: params.tenantId ?? null,
        userId: params.userId ?? null,

        action: params.action,
        module: params.module,

        entityType: params.entityType,
        entityId: params.entityId ?? null,

        description: params.description ?? null,

        oldData: params.oldData ?? undefined,
        newData: params.newData ?? undefined,

        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  }
}
