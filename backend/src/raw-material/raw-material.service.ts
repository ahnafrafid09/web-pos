import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { RawMaterialQueryDto } from './dto/raw-material-query.dto';

import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { getTenantId } from 'src/common/utils/tenant.util';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  AuditLogAction,
  Prisma,
  RawMaterial,
} from 'src/generated/prisma/client';

import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class RawMaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(currentUser: AuthenticatedUser, dto: CreateRawMaterialDto) {
    const tenantId = getTenantId(currentUser);

    const unit = await this.prisma.unit.findFirst({
      where: {
        id: dto.unitId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit tidak ditemukan');
    }

    if (dto.sku) {
      const existingRawMaterial = await this.prisma.rawMaterial.findFirst({
        where: {
          tenantId,
          sku: dto.sku,
        },
      });

      if (existingRawMaterial) {
        throw new ConflictException('SKU sudah digunakan');
      }
    }

    const rawMaterial = await this.prisma.rawMaterial.create({
      data: {
        tenantId,

        name: dto.name,

        sku: dto.sku || null,

        unitId: dto.unitId,

        averageCost: dto.averageCost ?? 0,

        stock: {
          create: {
            minimumStock: dto.minimumStock ?? 0,
          },
        },
      },

      include: {
        unit: true,
        stock: true,
      },
    });

    // =====================================================
    // AUDIT LOG
    // =====================================================

    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.CREATE,

      module: 'RAW_MATERIAL',

      entityType: 'RawMaterial',
      entityId: rawMaterial.id,

      description: `Bahan baku "${rawMaterial.name}" berhasil dibuat`,

      newData: {
        id: rawMaterial.id,
        name: rawMaterial.name,
        sku: rawMaterial.sku,
        unitId: rawMaterial.unitId,
        averageCost: rawMaterial.averageCost,
        status: rawMaterial.status,
        minimumStock: rawMaterial.stock?.minimumStock ?? 0,
      },
    });

    return this.toResponse(rawMaterial);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(currentUser: AuthenticatedUser, query: RawMaterialQueryDto) {
    const tenantId = getTenantId(currentUser);

    const { page = 1, limit = 10, search, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.RawMaterialWhereInput = {
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
          sku: {
            contains: search,
          },
        },
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    const [rawMaterials, total] = await this.prisma.$transaction([
      this.prisma.rawMaterial.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          unit: true,
          stock: true,
        },
      }),

      this.prisma.rawMaterial.count({
        where,
      }),
    ]);

    return {
      data: rawMaterials.map((rawMaterial) => this.toResponse(rawMaterial)),

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

    const rawMaterial = await this.prisma.rawMaterial.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        unit: true,
        stock: true,
      },
    });

    if (!rawMaterial) {
      throw new NotFoundException('Bahan baku tidak ditemukan');
    }

    return this.toResponse(rawMaterial);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdateRawMaterialDto,
  ) {
    const tenantId = getTenantId(currentUser);

    const rawMaterial = await this.prisma.rawMaterial.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        unit: true,
        stock: true,
      },
    });

    if (!rawMaterial) {
      throw new NotFoundException('Bahan baku tidak ditemukan');
    }

    // =====================================================
    // VALIDASI UNIT
    // =====================================================

    if (dto.unitId !== undefined && dto.unitId !== rawMaterial.unitId) {
      const unit = await this.prisma.unit.findFirst({
        where: {
          id: dto.unitId,
        },
      });

      if (!unit) {
        throw new NotFoundException('Unit tidak ditemukan');
      }
    }

    // =====================================================
    // VALIDASI SKU
    // =====================================================

    if (
      dto.sku !== undefined &&
      dto.sku !== rawMaterial.sku &&
      dto.sku !== ''
    ) {
      const existingRawMaterial = await this.prisma.rawMaterial.findFirst({
        where: {
          tenantId,

          sku: dto.sku,

          NOT: {
            id,
          },
        },
      });

      if (existingRawMaterial) {
        throw new ConflictException('SKU sudah digunakan');
      }
    }

    // =====================================================
    // UPDATE
    // =====================================================

    const updatedRawMaterial = await this.prisma.rawMaterial.update({
      where: {
        id,
      },

      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),

        ...(dto.sku !== undefined && {
          sku: dto.sku || null,
        }),

        ...(dto.unitId !== undefined && {
          unitId: dto.unitId,
        }),

        ...(dto.averageCost !== undefined && {
          averageCost: dto.averageCost,
        }),

        ...(dto.minimumStock !== undefined && {
          stock: {
            update: {
              minimumStock: dto.minimumStock,
            },
          },
        }),
      },

      include: {
        unit: true,
        stock: true,
      },
    });

    // =====================================================
    // AUDIT LOG
    // =====================================================

    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'RAW_MATERIAL',

      entityType: 'RawMaterial',
      entityId: rawMaterial.id,

      description: `Bahan baku "${rawMaterial.name}" berhasil diperbarui`,

      oldData: {
        id: rawMaterial.id,
        name: rawMaterial.name,
        sku: rawMaterial.sku,
        unitId: rawMaterial.unitId,
        averageCost: rawMaterial.averageCost,
        status: rawMaterial.status,
        minimumStock: rawMaterial.stock?.minimumStock ?? 0,
      },

      newData: {
        id: updatedRawMaterial.id,
        name: updatedRawMaterial.name,
        sku: updatedRawMaterial.sku,
        unitId: updatedRawMaterial.unitId,
        averageCost: updatedRawMaterial.averageCost,
        status: updatedRawMaterial.status,
        minimumStock: updatedRawMaterial.stock?.minimumStock ?? 0,
      },
    });

    return this.toResponse(updatedRawMaterial);
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async updateStatus(
    currentUser: AuthenticatedUser,
    id: string,
    status: boolean,
  ) {
    const tenantId = getTenantId(currentUser);

    const rawMaterial = await this.prisma.rawMaterial.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!rawMaterial) {
      throw new NotFoundException('Bahan baku tidak ditemukan');
    }

    const updatedRawMaterial = await this.prisma.rawMaterial.update({
      where: {
        id,
      },

      data: {
        status,
      },

      include: {
        unit: true,
        stock: true,
      },
    });

    // =====================================================
    // AUDIT LOG
    // =====================================================

    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'RAW_MATERIAL',

      entityType: 'RawMaterial',
      entityId: rawMaterial.id,

      description: status
        ? `Bahan baku "${rawMaterial.name}" diaktifkan`
        : `Bahan baku "${rawMaterial.name}" dinonaktifkan`,

      oldData: {
        status: rawMaterial.status,
      },

      newData: {
        status: updatedRawMaterial.status,
      },
    });

    return this.toResponse(updatedRawMaterial);
  }

  // =========================================================
  // RESPONSE
  // =========================================================

  private toResponse(
    rawMaterial: RawMaterial & {
      unit?: {
        name: string;
        code: string;
      } | null;

      stock?: {
        minimumStock: Prisma.Decimal;
      } | null;
    },
  ) {
    return {
      id: rawMaterial.id,

      tenantId: rawMaterial.tenantId,

      name: rawMaterial.name,

      sku: rawMaterial.sku,

      averageCost: rawMaterial.averageCost,

      status: rawMaterial.status,

      unit: rawMaterial.unit
        ? {
            name: rawMaterial.unit.name,
            code: rawMaterial.unit.code,
          }
        : null,

      stock: rawMaterial.stock
        ? {
            minimumStock: rawMaterial.stock.minimumStock,
          }
        : null,

      createdAt: rawMaterial.createdAt,

      updatedAt: rawMaterial.updatedAt,
    };
  }
}
