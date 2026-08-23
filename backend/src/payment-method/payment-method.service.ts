import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { PaymentMethod, Prisma } from 'src/generated/prisma/client';

import { getTenantId } from 'src/common/utils/tenant.util';

import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { QueryPaymentMethodDto } from './dto/payment-method-query.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { UpdatePaymentMethodStatusDto } from './dto/update-payment-method-status';

import { AuditLogService } from 'src/audit-log/audit-log.service';
import { AuditLogAction } from 'src/generated/prisma/enums';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(currentUser: AuthenticatedUser, dto: CreatePaymentMethodDto) {
    const tenantId = getTenantId(currentUser);

    const paymentMethod = await this.prisma.paymentMethod.create({
      data: {
        name: dto.name,
        code: dto.code,
        usageType: dto.usageType,
        tenantId,
      },
    });

    // =========================
    // AUDIT LOG
    // =========================
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.CREATE,
      module: 'PAYMENT_METHOD',

      entityType: 'PaymentMethod',
      entityId: paymentMethod.id,

      description: `Metode pembayaran "${paymentMethod.name}" berhasil dibuat`,

      newData: {
        name: paymentMethod.name,
        code: paymentMethod.code,
        usageType: paymentMethod.usageType,
        status: paymentMethod.status,
      },
    });

    return this.toResponse(paymentMethod);
  }

  async findAll(query: QueryPaymentMethodDto, currentUser: AuthenticatedUser) {
    const tenantId = getTenantId(currentUser);

    const { page = 1, limit = 10, search, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.PaymentMethodWhereInput = {
      tenantId,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
          },
        },
        {
          code: {
            contains: search,
          },
        },
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    const [paymentMethods, total] = await this.prisma.$transaction([
      this.prisma.paymentMethod.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.paymentMethod.count({
        where,
      }),
    ]);

    return {
      data: paymentMethods.map((paymentMethod) =>
        this.toResponse(paymentMethod),
      ),

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(currentUser: AuthenticatedUser, id: string) {
    const tenantId = getTenantId(currentUser);

    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        id,
        tenantId,
        status: true,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Metode pembayaran tidak ditemukan');
    }

    return {
      data: this.toResponse(paymentMethod),
    };
  }

  async update(
    currentUser: AuthenticatedUser,
    dto: UpdatePaymentMethodDto,
    id: string,
  ) {
    const tenantId = getTenantId(currentUser);

    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Metode pembayaran tidak ditemukan');
    }

    const data = {
      ...(dto.name !== undefined && {
        name: dto.name,
      }),

      ...(dto.code !== undefined && {
        code: dto.code,
      }),

      ...(dto.usageType !== undefined && {
        usageType: dto.usageType,
      }),
    };

    const updatedPaymentMethod = await this.prisma.paymentMethod.update({
      where: {
        id: paymentMethod.id,
      },

      data,
    });

    // =========================
    // AUDIT LOG
    // =========================
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,
      module: 'PAYMENT_METHOD',

      entityType: 'PaymentMethod',
      entityId: paymentMethod.id,

      description: `Metode pembayaran "${updatedPaymentMethod.name}" berhasil diperbarui`,

      oldData: {
        name: paymentMethod.name,
        code: paymentMethod.code,
        usageType: paymentMethod.usageType,
        status: paymentMethod.status,
      },

      newData: {
        name: updatedPaymentMethod.name,
        code: updatedPaymentMethod.code,
        usageType: updatedPaymentMethod.usageType,
        status: updatedPaymentMethod.status,
      },
    });

    return this.toResponse(updatedPaymentMethod);
  }

  async updateStatus(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdatePaymentMethodStatusDto,
  ) {
    const tenantId = getTenantId(currentUser);

    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Metode pembayaran tidak ditemukan');
    }

    const updatedPaymentMethod = await this.prisma.paymentMethod.update({
      where: {
        id: paymentMethod.id,
      },

      data: {
        status: dto.status,
      },
    });

    // =========================
    // AUDIT LOG
    // =========================
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,
      module: 'PAYMENT_METHOD',

      entityType: 'PaymentMethod',
      entityId: paymentMethod.id,

      description: dto.status
        ? `Metode pembayaran "${paymentMethod.name}" diaktifkan`
        : `Metode pembayaran "${paymentMethod.name}" dinonaktifkan`,

      oldData: {
        status: paymentMethod.status,
      },

      newData: {
        status: updatedPaymentMethod.status,
      },
    });

    return {
      message: dto.status
        ? 'Metode pembayaran berhasil diaktifkan'
        : 'Metode pembayaran berhasil dinonaktifkan',

      data: this.toResponse(updatedPaymentMethod),
    };
  }

  private toResponse(paymentMethod: PaymentMethod) {
    return {
      id: paymentMethod.id,
      name: paymentMethod.name,
      code: paymentMethod.code,
      usageType: paymentMethod.usageType,
      status: paymentMethod.status,
      tenantId: paymentMethod.tenantId,
      createdAt: paymentMethod.createdAt,
      updatedAt: paymentMethod.updatedAt,
    };
  }
}
