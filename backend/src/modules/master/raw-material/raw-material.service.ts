import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { RawMaterialQueryDto } from './dto/raw-material-query.dto';

import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';
import { getTenantId } from '../../../common/utils/tenant.util';
import { PrismaService } from '../../../prisma/prisma.service';

import {
  AuditLogAction,
  Prisma,
  RawMaterial,
} from '../../../generated/prisma/client';

import { AuditLogService } from '../../../audit-log/audit-log.service';

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

    // =====================================================
    // VALIDATE BASE UNIT
    // =====================================================

    const unit = await this.prisma.unit.findFirst({
      where: {
        id: dto.unitId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit dasar tidak ditemukan');
    }

    // =====================================================
    // VALIDATE SKU
    // =====================================================

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

    // =====================================================
    // VALIDATE CONVERSIONS
    // =====================================================

    const conversions = dto.conversions ?? [];

    const conversionUnitIds = conversions.map(
      (conversion) => conversion.unitId,
    );

    // Cegah unit conversion duplicate
    if (new Set(conversionUnitIds).size !== conversionUnitIds.length) {
      throw new BadRequestException('Unit conversion tidak boleh duplikat');
    }

    // Base unit tidak boleh menjadi conversion
    if (conversionUnitIds.includes(dto.unitId)) {
      throw new BadRequestException(
        'Unit dasar tidak boleh digunakan sebagai unit conversion',
      );
    }

    // =====================================================
    // GET CONVERSION UNITS
    // =====================================================

    if (conversionUnitIds.length > 0) {
      const conversionUnits = await this.prisma.unit.findMany({
        where: {
          id: {
            in: conversionUnitIds,
          },
        },
      });

      if (conversionUnits.length !== conversionUnitIds.length) {
        throw new NotFoundException(
          'Salah satu unit conversion tidak ditemukan',
        );
      }
    }

    // =====================================================
    // TRANSACTION
    // =====================================================

    const rawMaterial = await this.prisma.$transaction(async (tx) => {
      // ===============================================
      // CREATE RAW MATERIAL
      // ===============================================

      const rawMaterial = await tx.rawMaterial.create({
        data: {
          tenantId,

          name: dto.name,

          sku: dto.sku || null,

          unitId: dto.unitId,

          averageCost: dto.averageCost ?? 0,

          // =========================================
          // CREATE STOCK
          // =========================================

          stock: {
            create: {
              minimumStock: dto.minimumStock ?? 0,
            },
          },

          // =========================================
          // CREATE CONVERSIONS
          // =========================================

          unitConversions:
            conversions.length > 0
              ? {
                  create: conversions.map((conversion) => ({
                    unitId: conversion.unitId,
                    factor: conversion.factor,
                  })),
                }
              : undefined,
        },

        include: {
          unit: true,

          stock: true,

          unitConversions: {
            include: {
              unit: true,
            },
          },
        },
      });

      return rawMaterial;
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

        conversions: rawMaterial.unitConversions.map((conversion) => ({
          unitId: conversion.unitId,

          unitName: conversion.unit.name,

          factor: conversion.factor,
        })),
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
          unitConversions: {
            include: {
              unit: true,
            },
          },
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
        unitConversions: {
          include: {
            unit: true,
          },
        },
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

    // =====================================================
    // GET RAW MATERIAL
    // =====================================================

    const rawMaterial = await this.prisma.rawMaterial.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        unit: true,
        stock: true,

        unitConversions: {
          include: {
            unit: true,
          },
        },
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

    const newBaseUnitId = dto.unitId ?? rawMaterial.unitId;

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
    // VALIDASI CONVERSIONS
    // =====================================================

    if (dto.conversions !== undefined) {
      const conversionUnitIds = dto.conversions.map(
        (conversion) => conversion.unitId,
      );

      // -----------------------------------------------
      // Duplicate unit
      // -----------------------------------------------

      if (new Set(conversionUnitIds).size !== conversionUnitIds.length) {
        throw new BadRequestException('Unit conversion tidak boleh duplikat');
      }

      // -----------------------------------------------
      // Base unit tidak boleh menjadi conversion
      // -----------------------------------------------

      if (conversionUnitIds.includes(newBaseUnitId)) {
        throw new BadRequestException(
          'Unit dasar tidak boleh menjadi unit conversion',
        );
      }

      // -----------------------------------------------
      // Pastikan semua unit valid
      // -----------------------------------------------

      if (conversionUnitIds.length > 0) {
        const conversionUnits = await this.prisma.unit.findMany({
          where: {
            id: {
              in: conversionUnitIds,
            },
          },
        });

        if (conversionUnits.length !== conversionUnitIds.length) {
          throw new NotFoundException(
            'Salah satu unit conversion tidak ditemukan',
          );
        }
      }
    }

    // =====================================================
    // UPDATE
    // =====================================================

    const updatedRawMaterial = await this.prisma.$transaction(async (tx) => {
      // ---------------------------------------------
      // UPDATE RAW MATERIAL
      // ---------------------------------------------

      const updated = await tx.rawMaterial.update({
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

          unitConversions: {
            include: {
              unit: true,
            },
          },
        },
      });

      // ---------------------------------------------
      // UPDATE CONVERSIONS
      // ---------------------------------------------

      if (dto.conversions !== undefined) {
        // Hapus semua conversion lama
        await tx.rawMaterialUnitConversion.deleteMany({
          where: {
            rawMaterialId: id,
          },
        });

        // Buat conversion baru
        if (dto.conversions.length > 0) {
          await tx.rawMaterialUnitConversion.createMany({
            data: dto.conversions.map((conversion) => ({
              rawMaterialId: id,

              unitId: conversion.unitId,

              factor: conversion.factor,
            })),
          });
        }
      }

      // ---------------------------------------------
      // Ambil ulang data
      // ---------------------------------------------

      return tx.rawMaterial.findUniqueOrThrow({
        where: {
          id,
        },

        include: {
          unit: true,

          stock: true,

          unitConversions: {
            include: {
              unit: true,
            },
          },
        },
      });
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

        conversions: rawMaterial.unitConversions.map((conversion) => ({
          unitId: conversion.unitId,

          factor: conversion.factor,
        })),
      },

      newData: {
        id: updatedRawMaterial.id,

        name: updatedRawMaterial.name,

        sku: updatedRawMaterial.sku,

        unitId: updatedRawMaterial.unitId,

        averageCost: updatedRawMaterial.averageCost,

        status: updatedRawMaterial.status,

        minimumStock: updatedRawMaterial.stock?.minimumStock ?? 0,

        conversions: updatedRawMaterial.unitConversions.map((conversion) => ({
          unitId: conversion.unitId,

          factor: conversion.factor,
        })),
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

      unitConversions?: {
        id: string;
        factor: Prisma.Decimal;

        unit: {
          id: string;
          name: string;
          code: string;
        };
      }[];
    },
  ) {
    return {
      id: rawMaterial.id,

      tenantId: rawMaterial.tenantId,

      name: rawMaterial.name,

      sku: rawMaterial.sku,

      averageCost: rawMaterial.averageCost,

      status: rawMaterial.status,
      unitId: rawMaterial.unitId,

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

      conversions:
        rawMaterial.unitConversions?.map((conversion) => ({
          id: conversion.id,

          unit: {
            id: conversion.unit.id,
            name: conversion.unit.name,
            code: conversion.unit.code,
          },

          factor: conversion.factor,
        })) ?? [],

      createdAt: rawMaterial.createdAt,

      updatedAt: rawMaterial.updatedAt,
    };
  }
}
