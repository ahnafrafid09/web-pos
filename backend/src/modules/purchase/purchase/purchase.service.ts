import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';

import { getTenantId } from '../../../common/utils/tenant.util';

import {
  AdjustmentType,
  AuditLogAction,
  PurchaseStatus,
} from '../../../generated/prisma/enums';

import { AuditLogService } from '../../../audit-log/audit-log.service';

import { convertToBaseUnit } from '../../../common/utils/unit-convertion';

import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { randomUUID } from 'crypto';
import { PurchaseQueryDto } from './dto/purchase-query.dto';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(currentUser: AuthenticatedUser, dto: CreatePurchaseDto) {
    const tenantId = getTenantId(currentUser);

    if (!tenantId) {
      throw new ForbiddenException('User tidak memiliki tenant');
    }
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id: dto.supplierId,
        tenantId,
        status: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan atau tidak aktif');
    }

    // =========================================================
    // 2. VALIDASI ITEMS
    // =========================================================

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'Purchase harus memiliki minimal satu item',
      );
    }

    const rawMaterialIds = dto.items.map((item) => item.rawMaterialId);

    const uniqueRawMaterialIds = new Set(rawMaterialIds);

    if (uniqueRawMaterialIds.size !== rawMaterialIds.length) {
      throw new BadRequestException(
        'Raw material tidak boleh duplikat dalam satu purchase',
      );
    }

    const rawMaterials = await this.prisma.rawMaterial.findMany({
      where: {
        tenantId,
        id: {
          in: rawMaterialIds,
        },
        status: true,
      },
      include: {
        unit: true,
        unitConversions: {
          include: {
            unit: true,
          },
        },
      },
    });

    if (rawMaterials.length !== rawMaterialIds.length) {
      throw new BadRequestException(
        'Terdapat raw material yang tidak ditemukan atau tidak aktif',
      );
    }

    // =========================================================
    // 4. AMBIL UNIT
    // =========================================================

    const unitIds = [...new Set(dto.items.map((item) => item.unitId))];

    const units = await this.prisma.unit.findMany({
      where: {
        id: {
          in: unitIds,
        },
      },
    });

    if (units.length !== unitIds.length) {
      throw new BadRequestException('Terdapat unit yang tidak ditemukan');
    }

    const preparedItems: Array<{
      rawMaterial: (typeof rawMaterials)[number];
      unit: (typeof units)[number];

      quantity: number;
      unitId: string;

      baseQuantity: number;

      unitPrice: number;
      subtotal: number;

      unitCost: number;
    }> = [];

    for (const item of dto.items) {
      const rawMaterial = rawMaterials.find(
        (rm) => rm.id === item.rawMaterialId,
      );

      if (!rawMaterial) {
        throw new NotFoundException('Raw material tidak ditemukan');
      }

      const unit = units.find((u) => u.id === item.unitId);

      if (!unit) {
        throw new NotFoundException('Unit tidak ditemukan');
      }

      if (item.quantity <= 0) {
        throw new BadRequestException(
          `Quantity ${rawMaterial.name} harus lebih dari 0`,
        );
      }

      if (item.unitPrice < 0) {
        throw new BadRequestException(`Harga ${rawMaterial.name} tidak valid`);
      }

      // =======================================================
      // CONVERSION
      // =======================================================

      let baseQuantity = item.quantity;

      if (item.unitId !== rawMaterial.unitId) {
        let factor: number | null = null;

        // 1. Cari conversion dari relation RawMaterial
        const rawMaterialConversion = rawMaterial.unitConversions.find(
          (conversion) => conversion.unitId === item.unitId,
        );

        if (rawMaterialConversion) {
          factor = Number(rawMaterialConversion.factor);
        }

        if (factor === null) {
          const conversion = await this.prisma.unitConversion.findFirst({
            where: {
              fromUnitId: item.unitId,
              toUnitId: rawMaterial.unitId,
            },
          });

          if (!conversion) {
            throw new BadRequestException(
              `Konversi unit ${unit.name} ke ${rawMaterial.unit.name} untuk ${rawMaterial.name} tidak ditemukan`,
            );
          }

          factor = Number(conversion.factor);
        }

        baseQuantity = convertToBaseUnit(item.quantity, factor);
      }

      if (baseQuantity <= 0) {
        throw new BadRequestException(
          `Base quantity ${rawMaterial.name} tidak valid`,
        );
      }

      // =======================================================
      // SUBTOTAL
      // =======================================================

      const subtotal = Math.round(item.quantity * item.unitPrice);

      // =======================================================
      // HARGA PER BASE UNIT
      // =======================================================

      const unitCost = Math.round(subtotal / baseQuantity);

      preparedItems.push({
        rawMaterial,
        unit,

        quantity: item.quantity,

        unitId: item.unitId,

        baseQuantity,

        unitPrice: item.unitPrice,

        subtotal,

        unitCost,
      });
    }

    // =========================================================
    // 6. HITUNG TOTAL
    // =========================================================

    const subtotal = preparedItems.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    const discount = this.calculateAdjustment(
      subtotal,
      dto.discountType,
      dto.discountValue,
      'discount',
    );

    const afterDiscount = subtotal - discount;

    const tax = this.calculateAdjustment(
      afterDiscount,
      dto.taxType,
      dto.taxValue,
      'tax',
    );

    const totalAmount = afterDiscount + tax;

    // =========================================================
    // 7. PURCHASE NUMBER
    // =========================================================

    const purchaseDate = new Date(dto.purchaseDate);

    const purchaseNumber = this.generatePurchaseNumber(purchaseDate);

    // =========================================================
    // 8. TRANSACTION
    // =========================================================

    const purchase = await this.prisma.$transaction(async (tx) => {
      // ===================================================
      // CREATE PURCHASE
      // ===================================================

      const createdPurchase = await tx.purchase.create({
        data: {
          tenantId,

          supplierId: supplier.id,

          purchaseNumber,

          invoiceNumber: dto.invoiceNumber,

          purchaseType: dto.purchaseType,

          /**
           * DIRECT:
           * langsung dianggap selesai diterima.
           *
           * PO:
           * masih DRAFT.
           */
          status:
            dto.purchaseType === 'DIRECT'
              ? PurchaseStatus.RECEIVED
              : PurchaseStatus.DRAFT,

          purchaseDate,

          subtotal,

          discountType: dto.discountType,

          discountValue: dto.discountValue,

          discount,

          taxType: dto.taxType,

          taxValue: dto.taxValue,

          tax,

          totalAmount,

          items: {
            create: preparedItems.map((item) => ({
              rawMaterialId: item.rawMaterial.id,

              quantity: item.quantity,

              unitId: item.unitId,

              baseQuantity: item.baseQuantity,

              /**
               * DIRECT langsung diterima.
               */
              receivedBaseQuantity:
                dto.purchaseType === 'DIRECT' ? item.baseQuantity : 0,

              unitPrice: item.unitPrice,

              subtotal: item.subtotal,
            })),
          },
        },

        include: {
          supplier: true,

          items: {
            include: {
              rawMaterial: {
                include: {
                  unit: true,
                },
              },

              unit: true,
            },
          },
        },
      });

      // ===================================================
      // DIRECT PURCHASE
      // ===================================================

      if (dto.purchaseType === 'DIRECT') {
        // ================================================
        // RECEIVING NUMBER
        // ================================================

        const receivingNumber = this.generateReceivingNumber(purchaseDate);

        // ================================================
        // CREATE RECEIVING
        // ================================================

        const receiving = await tx.purchaseReceiving.create({
          data: {
            purchaseId: createdPurchase.id,

            receivingNumber,

            receivingDate: purchaseDate,

            note: 'Penerimaan otomatis dari pembelian DIRECT',

            items: {
              create: createdPurchase.items.map((purchaseItem) => {
                const preparedItem = preparedItems.find(
                  (item) => item.rawMaterial.id === purchaseItem.rawMaterialId,
                );

                if (!preparedItem) {
                  throw new BadRequestException(
                    'Data purchase item tidak ditemukan',
                  );
                }

                return {
                  purchaseItemId: purchaseItem.id,

                  quantity: preparedItem.quantity,

                  baseQuantity: preparedItem.baseQuantity,
                };
              }),
            },
          },

          include: {
            items: true,
          },
        });

        // ================================================
        // UPDATE STOCK
        // ================================================

        for (const item of preparedItems) {
          const stock = await tx.stock.findUnique({
            where: {
              rawMaterialId: item.rawMaterial.id,
            },
          });

          const oldQuantity = stock ? Number(stock.quantity) : 0;

          const oldAverageCost = Number(item.rawMaterial.averageCost);

          const incomingQuantity = item.baseQuantity;

          const incomingCost = item.subtotal;

          const newQuantity = oldQuantity + incomingQuantity;

          // ==============================================
          // AVERAGE COST
          // ==============================================

          let newAverageCost = item.unitCost;

          if (oldQuantity > 0 && oldAverageCost > 0) {
            const oldStockValue = oldQuantity * oldAverageCost;

            const totalStockValue = oldStockValue + incomingCost;

            newAverageCost = Math.round(totalStockValue / newQuantity);
          }

          // ==============================================
          // STOCK
          // ==============================================

          if (stock) {
            await tx.stock.update({
              where: {
                rawMaterialId: item.rawMaterial.id,
              },

              data: {
                quantity: newQuantity,
              },
            });
          } else {
            await tx.stock.create({
              data: {
                rawMaterialId: item.rawMaterial.id,

                quantity: incomingQuantity,

                minimumStock: 0,
              },
            });
          }

          // ==============================================
          // UPDATE AVERAGE COST
          // ==============================================

          await tx.rawMaterial.update({
            where: {
              id: item.rawMaterial.id,
            },

            data: {
              averageCost: newAverageCost,
            },
          });

          // ==============================================
          // STOCK MOVEMENT
          // ==============================================

          await tx.stockMovement.create({
            data: {
              tenantId,

              rawMaterialId: item.rawMaterial.id,

              type: 'PURCHASE',

              quantity: incomingQuantity,

              unitCost: item.unitCost,

              referenceId: receiving.id,

              referenceType: 'PurchaseReceiving',

              note: `Pembelian ${createdPurchase.purchaseNumber}`,
            },
          });
        }
      }

      return createdPurchase;
    });

    await this.auditLogService.create({
      tenantId,

      userId: currentUser.userId,

      action: AuditLogAction.CREATE,

      module: 'PURCHASE',

      entityType: 'Purchase',

      entityId: purchase.id,

      description: `Purchase "${purchase.purchaseNumber}" berhasil dibuat`,

      newData: {
        id: purchase.id,

        purchaseNumber: purchase.purchaseNumber,

        supplierId: purchase.supplierId,

        supplierName: supplier.name,

        purchaseType: purchase.purchaseType,

        status: purchase.status,

        subtotal: purchase.subtotal,

        discount: purchase.discount,

        tax: purchase.tax,

        totalAmount: purchase.totalAmount,

        items: purchase.items.map((item) => ({
          id: item.id,

          rawMaterialId: item.rawMaterialId,

          rawMaterialName: item.rawMaterial.name,

          quantity: item.quantity,

          unitId: item.unitId,

          unitName: item.unit.name,

          baseQuantity: item.baseQuantity,

          unitPrice: item.unitPrice,

          subtotal: item.subtotal,
        })),
      },
    });

    return purchase;
  }

  async findAll(currentUser: AuthenticatedUser, query: PurchaseQueryDto) {
    const tenantId = getTenantId(currentUser);

    if (!tenantId) {
      throw new ForbiddenException('User tidak memiliki tenant');
    }

    const {
      page = 1,
      limit = 10,
      search,
      status,
      purchaseType,
      supplierId,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.PurchaseWhereInput = {
      tenantId,

      ...(status && {
        status,
      }),

      ...(purchaseType && {
        purchaseType,
      }),

      ...(supplierId && {
        supplierId,
      }),

      ...(search && {
        OR: [
          {
            purchaseNumber: {
              contains: search,
            },
          },
          {
            invoiceNumber: {
              contains: search,
            },
          },
          {
            supplier: {
              name: {
                contains: search,
              },
            },
          },
        ],
      }),

      ...(startDate || endDate
        ? {
            purchaseDate: {
              ...(startDate && {
                gte: new Date(`${startDate}T00:00:00`),
              }),

              ...(endDate && {
                lte: new Date(`${endDate}T23:59:59.999`),
              }),
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.purchase.findMany({
        where,

        skip,
        take: limit,

        include: {
          supplier: true,

          items: {
            include: {
              rawMaterial: {
                include: {
                  unit: true,
                },
              },

              unit: true,
            },
          },
        },

        orderBy: {
          purchaseDate: 'desc',
        },
      }),

      this.prisma.purchase.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,

      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(currentUser: AuthenticatedUser, id: string) {
    const tenantId = getTenantId(currentUser);

    if (!tenantId) {
      throw new ForbiddenException('User tidak memiliki tenant');
    }

    const purchase = await this.prisma.purchase.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        supplier: true,

        items: {
          include: {
            rawMaterial: {
              include: {
                unit: true,
              },
            },

            unit: true,

            receivingItems: true,
          },
        },

        receivings: {
          include: {
            items: true,
          },
        },

        payments: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase tidak ditemukan');
    }

    return purchase;
  }

  // =========================================================
  // CALCULATE ADJUSTMENT
  // =========================================================

  private calculateAdjustment(
    amount: number,
    type: AdjustmentType | null | undefined,
    value: number | null | undefined,
    fieldName: string,
  ): number {
    // Tidak ada adjustment
    if (value === null || value === undefined || value === 0) {
      return 0;
    }

    // Value ada, tapi type tidak ada
    if (!type) {
      throw new BadRequestException(
        `${fieldName} type wajib diisi jika value lebih dari 0`,
      );
    }

    if (value < 0) {
      throw new BadRequestException(`${fieldName} tidak boleh kurang dari 0`);
    }

    if (type === AdjustmentType.PERCENTAGE) {
      if (value > 100) {
        throw new BadRequestException(
          `${fieldName} percentage tidak boleh lebih dari 100%`,
        );
      }

      return Math.round((amount * value) / 100);
    }

    if (type === AdjustmentType.FIXED) {
      if (value > amount) {
        throw new BadRequestException(
          `${fieldName} tidak boleh lebih besar dari nilai transaksi`,
        );
      }

      return Math.round(value);
    }

    throw new BadRequestException(`Tipe ${fieldName} tidak valid`);
  }

  private generatePurchaseNumber(purchaseDate: Date): string {
    const date = new Date(purchaseDate);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    const random = randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase();

    return `PUR-${year}${month}${day}-${random}`;
  }

  private generateReceivingNumber(purchaseDate: Date): string {
    const date = new Date(purchaseDate);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    const random = randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase();

    return `REC-${year}${month}${day}-${random}`;
  }
}
