import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';

import {
  AuditLogAction,
  Supplier,
  Prisma,
} from '../../../generated/prisma/client';

import { getTenantId } from '../../../common/utils/tenant.util';

import { AuditLogService } from '../../../audit-log/audit-log.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierQueryDto } from './dto/supplier-query.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UpdateSupplierStatusDto } from './dto/update-supplier-status.dto';

@Injectable()
export class SupplierService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(currentUser: AuthenticatedUser, dto: CreateSupplierDto) {
    const tenantId = getTenantId(currentUser);

    if (dto.code) {
      const existingCodeSupplier = await this.prisma.supplier.findFirst({
        where: {
          tenantId,
          code: dto.code,
        },
      });

      if (existingCodeSupplier) {
        throw new ConflictException('Code sudah digunakan');
      }
    }

    const supplier = await this.prisma.supplier.create({
      data: {
        name: dto.name,
        code: dto.code,
        phone: dto.phone,
        address: dto.address,
        email: dto.email,
        tenantId,
      },
    });

    // Audit Log
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.CREATE,

      module: 'SUPPLIER',

      entityType: 'Supplier',
      entityId: supplier.id,

      description: `Supplier "${supplier.name}" berhasil dibuat`,

      newData: {
        id: supplier.id,
        name: supplier.name,
        status: supplier.status,
      },
    });

    return this.toResponse(supplier);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(query: SupplierQueryDto, currentUser: AuthenticatedUser) {
    const tenantId = getTenantId(currentUser);

    const { page = 1, limit = 10, search, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.SupplierWhereInput = {
      tenantId,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
          },
        },
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    const [suppliers, total] = await this.prisma.$transaction([
      this.prisma.supplier.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.supplier.count({
        where,
      }),
    ]);

    return {
      data: suppliers.map((supplier) => this.toResponse(supplier)),

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(currentUser: AuthenticatedUser, id: string) {
    const tenantId = getTenantId(currentUser);

    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        tenantId,
        status: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    return {
      data: this.toResponse(supplier),
    };
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    currentUser: AuthenticatedUser,
    dto: UpdateSupplierDto,
    id: string,
  ) {
    const tenantId = getTenantId(currentUser);

    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    if (dto.code) {
      const existingCodeSupplier = await this.prisma.supplier.findFirst({
        where: {
          tenantId,
          code: dto.code,
        },
      });

      if (existingCodeSupplier) {
        throw new ConflictException('SKU sudah digunakan');
      }
    }

    const data: Prisma.SupplierUpdateInput = {
      ...(dto.name !== undefined && {
        name: dto.name,
      }),
      ...(dto.code !== undefined && {
        code: dto.code,
      }),
      ...(dto.email !== undefined && {
        email: dto.email,
      }),
      ...(dto.phone !== undefined && {
        phone: dto.phone,
      }),
      ...(dto.address !== undefined && {
        address: dto.address,
      }),
    };

    const updatedSupplier = await this.prisma.supplier.update({
      where: {
        id: supplier.id,
      },

      data,
    });

    // Audit Log
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'SUPPLIER',

      entityType: 'Supplier',
      entityId: supplier.id,

      description: `Supplier "${supplier.name}" berhasil diperbarui`,

      oldData: {
        id: supplier.id,
        name: supplier.name,
        status: supplier.status,
      },

      newData: {
        id: updatedSupplier.id,
        name: updatedSupplier.name,
        status: updatedSupplier.status,
      },
    });

    return this.toResponse(updatedSupplier);
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async updateStatus(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdateSupplierStatusDto,
  ) {
    const tenantId = getTenantId(currentUser);

    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('supplier tidak ditemukan');
    }

    const updateSupplier = await this.prisma.supplier.update({
      where: {
        id: supplier.id,
      },

      data: {
        status: dto.status,
      },
    });

    // Audit Log
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'SUPPLIER',

      entityType: 'Supplier',
      entityId: supplier.id,

      description: dto.status
        ? `Supllier "${supplier.name}" diaktifkan`
        : `Supplier "${supplier.name}" dinonaktifkan`,

      oldData: {
        id: supplier.id,
        name: supplier.name,
        status: supplier.status,
      },

      newData: {
        id: updateSupplier.id,
        name: updateSupplier.name,
        status: updateSupplier.status,
      },
    });

    return {
      message: dto.status
        ? 'Supplier berhasil diaktifkan'
        : 'Supplier berhasil dinonaktifkan',

      data: this.toResponse(updateSupplier),
    };
  }

  // =========================================================
  // RESPONSE
  // =========================================================

  private toResponse(supplier: Supplier) {
    return {
      id: supplier.id,
      name: supplier.name,
      status: supplier.status,
      code: supplier.code,
      tenantId: supplier.tenantId,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    };
  }
}
