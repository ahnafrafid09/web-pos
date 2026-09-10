import { Injectable } from '@nestjs/common';
import { ModuleCode, TenantModuleStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModuleAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async hasAccess(tenantId: string, moduleCode: ModuleCode): Promise<boolean> {
    const tenantModule = await this.prisma.tenantModule.findFirst({
      where: {
        tenantId,

        module: {
          code: moduleCode,
          status: true,
        },

        status: TenantModuleStatus.ACTIVE,
      },

      select: {
        id: true,
        status: true,
        expiredAt: true,
      },
    });

    if (!tenantModule) {
      return false;
    }

    // Kalau punya tanggal expired
    if (tenantModule.expiredAt && tenantModule.expiredAt <= new Date()) {
      return false;
    }

    return true;
  }
}
