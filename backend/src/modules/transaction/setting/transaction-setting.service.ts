import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateTransactionSettingDto } from './dto/update-transaction-setting.dto';
import { getTenantId } from 'src/common/utils/tenant.util';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Injectable()
export class TransactionSettingService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(currentUser: AuthenticatedUser) {
    const tenantId = getTenantId(currentUser);
    console.log(tenantId);
    if (!tenantId) {
      throw new ForbiddenException('User tidak memiliki tenant');
    }
    let setting = await this.prisma.transactionSetting.findUnique({
      where: {
        tenantId,
      },
    });

    if (!setting) {
      setting = await this.prisma.transactionSetting.create({
        data: {
          tenantId,

          taxEnabled: false,
          taxRate: 0,

          serviceChargeEnabled: false,
          serviceChargeRate: 0,
        },
      });
    }

    return setting;
  }

  async update(
    currentUser: AuthenticatedUser,
    dto: UpdateTransactionSettingDto,
  ) {
    const tenantId = getTenantId(currentUser);
    if (!tenantId) {
      throw new ForbiddenException('User tidak memiliki tenant');
    }
    return this.prisma.transactionSetting.upsert({
      where: {
        tenantId,
      },

      create: {
        tenantId,

        taxEnabled: dto.taxEnabled ?? false,
        taxRate: dto.taxRate ?? 0,

        serviceChargeEnabled: dto.serviceChargeEnabled ?? false,

        serviceChargeRate: dto.serviceChargeRate ?? 0,
      },

      update: {
        ...(dto.taxEnabled !== undefined && {
          taxEnabled: dto.taxEnabled,
        }),

        ...(dto.taxRate !== undefined && {
          taxRate: dto.taxRate,
        }),

        ...(dto.serviceChargeEnabled !== undefined && {
          serviceChargeEnabled: dto.serviceChargeEnabled,
        }),

        ...(dto.serviceChargeRate !== undefined && {
          serviceChargeRate: dto.serviceChargeRate,
        }),
      },
    });
  }
}
