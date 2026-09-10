import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

import { PrismaService } from '../../../prisma/prisma.service';
import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';

import { getTenantId } from '../../../common/utils/tenant.util';
import { convertToBaseUnit } from '../../../common/utils/unit-convertion';

import { AuditLogAction, ProductType } from '../../../generated/prisma/enums';

import { AuditLogService } from '../../../audit-log/audit-log.service';

@Injectable()
export class RecipeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // ===========================================================
  // HELPER
  // VALIDASI PRODUCT
  // ===========================================================

  private async validateProduct(
    currentUser: AuthenticatedUser,
    productId: string,
  ) {
    const tenantId = getTenantId(currentUser);

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product tidak ditemukan');
    }

    if (product.type !== ProductType.MENU) {
      throw new BadRequestException(
        'Recipe hanya dapat dibuat untuk product MENU',
      );
    }

    return product;
  }

  // ===========================================================
  // HELPER
  // VALIDASI + CONVERT UNIT
  //
  // PRIORITY:
  //
  // 1. SAME UNIT
  // 2. RAW MATERIAL CONVERSION
  // 3. GLOBAL DIRECT
  // 4. GLOBAL REVERSE
  // 5. REJECT
  // ===========================================================

  private async calculateBaseQuantity(
    rawMaterialId: string,
    quantity: number,
    unitId: string,
    tenantId: string,
    tx?: any,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException(
        `Quantity untuk raw material "${rawMaterialId}" harus lebih besar dari 0`,
      );
    }

    const prisma = tx ?? this.prisma;

    // =========================================================
    // RAW MATERIAL
    // =========================================================

    const rawMaterial = await prisma.rawMaterial.findFirst({
      where: {
        id: rawMaterialId,
        tenantId,
      },

      include: {
        unit: true,
      },
    });

    if (!rawMaterial) {
      throw new NotFoundException(
        `Raw material "${rawMaterialId}" tidak ditemukan`,
      );
    }

    // =========================================================
    // VALIDASI UNIT INPUT
    // =========================================================

    const inputUnit = await prisma.unit.findFirst({
      where: {
        id: unitId,
      },
    });

    if (!inputUnit) {
      throw new NotFoundException(`Unit "${unitId}" tidak ditemukan`);
    }

    // =========================================================
    // 1. SAME UNIT
    // =========================================================

    if (unitId === rawMaterial.unitId) {
      return {
        rawMaterial,
        inputUnit,
        baseQuantity: quantity,
        factor: 1,
        conversionSource: 'BASE',
      };
    }

    // =========================================================
    // 2. RAW MATERIAL SPECIFIC CONVERSION
    //
    // Contoh:
    //
    // Base = Sachet
    //
    // Renceng = 20 Sachet
    //
    // factor = 20
    // =========================================================

    const rawMaterialConversion =
      await this.prisma.rawMaterialUnitConversion.findFirst({
        where: {
          rawMaterialId: rawMaterial.id,
          unitId,
        },
      });

    if (rawMaterialConversion) {
      const factor = Number(rawMaterialConversion.factor);

      if (factor <= 0) {
        throw new BadRequestException(
          `Factor conversion untuk "${rawMaterial.name}" tidak valid`,
        );
      }

      return {
        rawMaterial,
        inputUnit,
        baseQuantity: convertToBaseUnit(quantity, factor),
        factor,
        conversionSource: 'RAW_MATERIAL',
      };
    }

    // =========================================================
    // 3. GLOBAL CONVERSION DIRECT
    //
    // Contoh:
    //
    // Kuintal -> Gram
    //
    // factor = 100000
    // =========================================================

    const directConversion = await prisma.unitConversion.findFirst({
      where: {
        fromUnitId: unitId,
        toUnitId: rawMaterial.unitId,
      },
    });

    if (directConversion) {
      const factor = Number(directConversion.factor);

      if (factor <= 0) {
        throw new BadRequestException(
          `Factor global conversion dari "${inputUnit.name}" ke "${rawMaterial.unit.name}" tidak valid`,
        );
      }

      return {
        rawMaterial,
        inputUnit,
        baseQuantity: convertToBaseUnit(quantity, factor),
        factor,
        conversionSource: 'GLOBAL',
      };
    }

    // =========================================================
    // 4. GLOBAL CONVERSION REVERSE
    //
    // Contoh:
    //
    // Gram -> Kuintal
    // factor = 0.00001
    //
    // Maka:
    //
    // Kuintal -> Gram
    // = 1 / 0.00001
    // = 100000
    // =========================================================

    const reverseConversion = await prisma.unitConversion.findFirst({
      where: {
        fromUnitId: rawMaterial.unitId,
        toUnitId: unitId,
      },
    });

    if (reverseConversion) {
      const factor = Number(reverseConversion.factor);

      if (factor <= 0) {
        throw new BadRequestException(
          `Factor global conversion dari "${rawMaterial.unit.name}" ke "${inputUnit.name}" tidak valid`,
        );
      }

      const reverseFactor = 1 / factor;

      return {
        rawMaterial,
        inputUnit,
        baseQuantity: convertToBaseUnit(quantity, reverseFactor),
        factor: reverseFactor,
        conversionSource: 'GLOBAL',
      };
    }

    // =========================================================
    // 5. TIDAK ADA CONVERSION
    // =========================================================

    throw new BadRequestException(
      `Tidak ada konversi dari unit "${inputUnit.name}" ke unit base "${rawMaterial.unit.name}" untuk raw material "${rawMaterial.name}"`,
    );
  }

  // ===========================================================
  // CREATE
  //
  // CREATE BANYAK RECIPE ITEM SEKALIGUS
  // ===========================================================

  async create(
    currentUser: AuthenticatedUser,
    productId: string,
    dto: CreateRecipeDto,
  ) {
    const tenantId = getTenantId(currentUser);

    // =========================================================
    // 1. VALIDASI PRODUCT
    // =========================================================

    const product = await this.validateProduct(currentUser, productId);

    // =========================================================
    // 2. VALIDASI ITEMS
    // =========================================================

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Recipe minimal memiliki 1 bahan baku');
    }

    // =========================================================
    // 3. CEK DUPLICATE DALAM REQUEST
    // =========================================================

    const rawMaterialIds = dto.items.map((item) => item.rawMaterialId);

    const uniqueRawMaterialIds = new Set(rawMaterialIds);

    if (uniqueRawMaterialIds.size !== rawMaterialIds.length) {
      throw new BadRequestException(
        'Raw material tidak boleh duplikat dalam satu recipe',
      );
    }

    // =========================================================
    // 4. CEK APAKAH RECIPE SUDAH ADA
    // =========================================================

    const existingRecipe = await this.prisma.recipeItem.findFirst({
      where: {
        productId,
      },
    });

    if (existingRecipe) {
      throw new BadRequestException(
        'Recipe product ini sudah ada. Gunakan update recipe.',
      );
    }

    // =========================================================
    // 5. TRANSACTION
    // =========================================================

    const recipeItems = await this.prisma.$transaction(async (tx) => {
      const createdItems: any[] = [];

      for (const item of dto.items) {
        // ===================================================
        // CONVERT
        // ===================================================

        const conversion = await this.calculateBaseQuantity(
          item.rawMaterialId,
          item.quantity,
          item.unitId,
          tenantId,
          tx,
        );

        // ===================================================
        // CREATE
        // ===================================================

        const recipeItem = await tx.recipeItem.create({
          data: {
            productId,

            rawMaterialId: conversion.rawMaterial.id,

            /**
             * SIMPAN DALAM BASE UNIT
             */
            quantity: conversion.baseQuantity,
          },

          include: {
            rawMaterial: {
              include: {
                unit: true,
              },
            },
          },
        });

        createdItems.push({
          ...recipeItem,

          inputQuantity: item.quantity,

          inputUnitId: item.unitId,

          inputUnitName: conversion.inputUnit.name,

          baseQuantity: conversion.baseQuantity,

          baseUnitId: conversion.rawMaterial.unitId,

          baseUnitName: conversion.rawMaterial.unit.name,

          conversionFactor: conversion.factor,

          conversionSource: conversion.conversionSource,
        });
      }

      return createdItems;
    });

    // =========================================================
    // 6. AUDIT LOG
    // =========================================================

    await this.auditLogService.create({
      tenantId,

      userId: currentUser.userId,

      action: AuditLogAction.CREATE,

      module: 'RECIPE',

      entityType: 'Product',

      entityId: product.id,

      description: `Recipe "${product.name}" dibuat dengan ${recipeItems.length} bahan`,

      newData: {
        productId: product.id,

        productName: product.name,

        items: recipeItems.map((item) => ({
          id: item.id,

          rawMaterialId: item.rawMaterialId,

          rawMaterialName: item.rawMaterial.name,

          inputQuantity: item.inputQuantity,

          inputUnitId: item.inputUnitId,

          inputUnitName: item.inputUnitName,

          quantity: Number(item.quantity),

          baseQuantity: item.baseQuantity,

          baseUnitId: item.baseUnitId,

          baseUnitName: item.baseUnitName,

          conversionFactor: item.conversionFactor,

          conversionSource: item.conversionSource,
        })),
      },
    });

    return {
      message: 'Recipe berhasil dibuat',

      productId: product.id,

      productName: product.name,

      items: recipeItems,
    };
  }

  // ===========================================================
  // UPDATE RECIPE
  //
  // UPDATE SELURUH RECIPE SEKALIGUS
  //
  // Kalau frontend kirim:
  //
  // A
  // B
  // C
  //
  // Sedangkan database:
  //
  // A
  // B
  // D
  //
  // Maka hasil:
  //
  // A -> update
  // B -> update
  // C -> create
  // D -> delete
  // ===========================================================

  async updateRecipe(
    currentUser: AuthenticatedUser,
    productId: string,
    dto: CreateRecipeDto,
  ) {
    const tenantId = getTenantId(currentUser);

    // =========================================================
    // 1. VALIDASI PRODUCT
    // =========================================================

    const product = await this.validateProduct(currentUser, productId);

    // =========================================================
    // 2. VALIDASI ITEMS
    // =========================================================

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Recipe minimal memiliki 1 bahan baku');
    }

    // =========================================================
    // 3. DUPLICATE DALAM REQUEST
    // =========================================================

    const rawMaterialIds = dto.items.map((item) => item.rawMaterialId);

    const uniqueRawMaterialIds = new Set(rawMaterialIds);

    if (uniqueRawMaterialIds.size !== rawMaterialIds.length) {
      throw new BadRequestException(
        'Raw material tidak boleh duplikat dalam satu recipe',
      );
    }

    // =========================================================
    // 4. AMBIL RECIPE LAMA
    // =========================================================

    const existingItems = await this.prisma.recipeItem.findMany({
      where: {
        productId,
      },

      include: {
        rawMaterial: {
          include: {
            unit: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    // =========================================================
    // 5. TRANSACTION
    // =========================================================

    const result = await this.prisma.$transaction(async (tx) => {
      const finalItems: any[] = [];

      // =======================================================
      // VALIDASI SEMUA ITEM + CONVERSION
      // DILAKUKAN TERLEBIH DAHULU
      // =======================================================

      const preparedItems: any[] = [];

      for (const item of dto.items) {
        const conversion = await this.calculateBaseQuantity(
          item.rawMaterialId,
          item.quantity,
          item.unitId,
          tenantId,
          tx,
        );

        preparedItems.push({
          input: item,
          conversion,
        });
      }

      // =======================================================
      // HAPUS ITEM YANG SUDAH TIDAK ADA
      // =======================================================

      const requestRawMaterialIds = new Set(rawMaterialIds);

      const itemsToDelete = existingItems.filter(
        (existing) => !requestRawMaterialIds.has(existing.rawMaterialId),
      );

      for (const item of itemsToDelete) {
        await tx.recipeItem.delete({
          where: {
            id: item.id,
          },
        });
      }

      // =======================================================
      // UPDATE / CREATE
      // =======================================================

      for (const prepared of preparedItems) {
        const item = prepared.input;
        const conversion = prepared.conversion;

        const existingItem = existingItems.find(
          (existing) => existing.rawMaterialId === item.rawMaterialId,
        );

        // =====================================================
        // UPDATE
        // =====================================================

        if (existingItem) {
          const updated = await tx.recipeItem.update({
            where: {
              id: existingItem.id,
            },

            data: {
              rawMaterialId: conversion.rawMaterial.id,

              quantity: conversion.baseQuantity,
            },

            include: {
              rawMaterial: {
                include: {
                  unit: true,
                },
              },
            },
          });

          finalItems.push({
            ...updated,

            action: 'UPDATE',

            inputQuantity: item.quantity,

            inputUnitId: item.unitId,

            inputUnitName: conversion.inputUnit.name,

            baseQuantity: conversion.baseQuantity,

            baseUnitId: conversion.rawMaterial.unitId,

            baseUnitName: conversion.rawMaterial.unit.name,

            conversionFactor: conversion.factor,

            conversionSource: conversion.conversionSource,
          });
        }

        // =====================================================
        // CREATE
        // =====================================================
        else {
          const created = await tx.recipeItem.create({
            data: {
              productId,

              rawMaterialId: conversion.rawMaterial.id,

              quantity: conversion.baseQuantity,
            },

            include: {
              rawMaterial: {
                include: {
                  unit: true,
                },
              },
            },
          });

          finalItems.push({
            ...created,

            action: 'CREATE',

            inputQuantity: item.quantity,

            inputUnitId: item.unitId,

            inputUnitName: conversion.inputUnit.name,

            baseQuantity: conversion.baseQuantity,

            baseUnitId: conversion.rawMaterial.unitId,

            baseUnitName: conversion.rawMaterial.unit.name,

            conversionFactor: conversion.factor,

            conversionSource: conversion.conversionSource,
          });
        }
      }

      return {
        finalItems,

        deletedItems: itemsToDelete,
      };
    });

    // =========================================================
    // 6. AUDIT LOG
    // =========================================================

    await this.auditLogService.create({
      tenantId,

      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'RECIPE',

      entityType: 'Product',

      entityId: product.id,

      description: `Recipe "${product.name}" diperbarui dengan ${result.finalItems.length} bahan`,

      oldData: {
        items: existingItems.map((item) => ({
          id: item.id,

          rawMaterialId: item.rawMaterialId,

          rawMaterialName: item.rawMaterial.name,

          quantity: Number(item.quantity),
        })),
      },

      newData: {
        items: result.finalItems.map((item) => ({
          id: item.id,

          action: item.action,

          rawMaterialId: item.rawMaterialId,

          rawMaterialName: item.rawMaterial.name,

          inputQuantity: item.inputQuantity,

          inputUnitId: item.inputUnitId,

          inputUnitName: item.inputUnitName,

          quantity: Number(item.quantity),

          baseQuantity: item.baseQuantity,

          baseUnitId: item.baseUnitId,

          baseUnitName: item.baseUnitName,

          conversionFactor: item.conversionFactor,

          conversionSource: item.conversionSource,
        })),

        deletedItems: result.deletedItems.map((item) => ({
          id: item.id,

          rawMaterialId: item.rawMaterialId,

          rawMaterialName: item.rawMaterial.name,

          quantity: Number(item.quantity),
        })),
      },
    });

    return {
      message: 'Recipe berhasil diperbarui',

      productId: product.id,

      productName: product.name,

      items: result.finalItems,

      deletedItems: result.deletedItems.map((item) => ({
        id: item.id,

        rawMaterialId: item.rawMaterialId,

        rawMaterialName: item.rawMaterial.name,
      })),
    };
  }

  // ===========================================================
  // FIND ALL
  // ===========================================================

  async findAll(currentUser: AuthenticatedUser, productId: string) {
    const tenantId = getTenantId(currentUser);

    await this.validateProduct(currentUser, productId);

    return this.prisma.recipeItem.findMany({
      where: {
        productId,

        product: {
          tenantId,
        },
      },

      include: {
        rawMaterial: {
          include: {
            unit: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // ===========================================================
  // FIND ONE
  // ===========================================================

  async findOne(
    currentUser: AuthenticatedUser,
    productId: string,
    itemId: string,
  ) {
    const tenantId = getTenantId(currentUser);

    const recipeItem = await this.prisma.recipeItem.findFirst({
      where: {
        id: itemId,

        productId,

        product: {
          tenantId,
        },
      },

      include: {
        rawMaterial: {
          include: {
            unit: true,
          },
        },

        product: true,
      },
    });

    if (!recipeItem) {
      throw new NotFoundException('Recipe item tidak ditemukan');
    }

    return recipeItem;
  }

  // ===========================================================
  // UPDATE SINGLE ITEM
  // ===========================================================

  // async update(
  //   currentUser: AuthenticatedUser,
  //   productId: string,
  //   itemId: string,
  //   dto: UpdateRecipeDto,
  // ) {
  //   const tenantId = getTenantId(currentUser);

  //   // =========================================================
  //   // 1. CARI RECIPE ITEM
  //   // =========================================================

  //   const recipeItem = await this.prisma.recipeItem.findFirst({
  //     where: {
  //       id: itemId,

  //       productId,

  //       product: {
  //         tenantId,
  //       },
  //     },

  //     include: {
  //       rawMaterial: {
  //         include: {
  //           unit: true,
  //         },
  //       },

  //       unit: true,

  //       product: true,
  //     },
  //   });

  //   if (!recipeItem) {
  //     throw new NotFoundException('Recipe item tidak ditemukan');
  //   }

  //   // =========================================================
  //   // 2. TENTUKAN RAW MATERIAL
  //   // =========================================================

  //   const rawMaterialId = dto.rawMaterialId ?? recipeItem.rawMaterialId;

  //   const rawMaterial = await this.prisma.rawMaterial.findFirst({
  //     where: {
  //       id: rawMaterialId,

  //       tenantId,
  //     },

  //     include: {
  //       unit: true,
  //     },
  //   });

  //   if (!rawMaterial) {
  //     throw new NotFoundException('Raw material tidak ditemukan');
  //   }

  //   // =========================================================
  //   // 3. CEK DUPLICATE
  //   // =========================================================

  //   if (dto.rawMaterialId && dto.rawMaterialId !== recipeItem.rawMaterialId) {
  //     const existingRecipeItem = await this.prisma.recipeItem.findFirst({
  //       where: {
  //         productId,

  //         rawMaterialId: dto.rawMaterialId,

  //         NOT: {
  //           id: itemId,
  //         },
  //       },
  //     });

  //     if (existingRecipeItem) {
  //       throw new BadRequestException(
  //         'Raw material sudah ada di recipe product ini',
  //       );
  //     }
  //   }

  //   // =========================================================
  //   // 4. QUANTITY
  //   // =========================================================

  //   let baseQuantity = Number(recipeItem.quantity);

  //   let inputUnitId = recipeItem.unitId;

  //   let conversionFactor = 1;

  //   let conversionSource = 'BASE';

  //   let inputQuantity = Number(recipeItem.quantity);

  //   if (dto.quantity !== undefined || dto.unitId !== undefined) {
  //     const quantity =
  //       dto.quantity !== undefined ? dto.quantity : Number(recipeItem.quantity);

  //     const unitId = dto.unitId ?? recipeItem.unitId ?? rawMaterial.unitId;

  //     const conversion = await this.calculateBaseQuantity(
  //       rawMaterial.id,
  //       quantity,
  //       unitId,
  //       tenantId,
  //     );

  //     baseQuantity = conversion.baseQuantity;

  //     inputUnitId = unitId;

  //     inputQuantity = quantity;

  //     conversionFactor = conversion.factor;

  //     conversionSource = conversion.conversionSource;
  //   }

  //   // =========================================================
  //   // 5. UPDATE
  //   // =========================================================

  //   const updatedRecipeItem = await this.prisma.recipeItem.update({
  //     where: {
  //       id: itemId,
  //     },

  //     data: {
  //       rawMaterialId,

  //       quantity: baseQuantity,

  //       unitId: inputUnitId,
  //     },

  //     include: {
  //       rawMaterial: {
  //         include: {
  //           unit: true,
  //         },
  //       },

  //       unit: true,
  //     },
  //   });

  //   // =========================================================
  //   // 6. AUDIT LOG
  //   // =========================================================

  //   await this.auditLogService.create({
  //     tenantId,

  //     userId: currentUser.userId,

  //     action: AuditLogAction.UPDATE,

  //     module: 'RECIPE',

  //     entityType: 'RecipeItem',

  //     entityId: updatedRecipeItem.id,

  //     description: `Recipe "${recipeItem.product.name}" diperbarui`,

  //     oldData: {
  //       rawMaterialId: recipeItem.rawMaterialId,

  //       rawMaterialName: recipeItem.rawMaterial.name,

  //       quantity: Number(recipeItem.quantity),

  //       unitId: recipeItem.unitId,

  //       unitName: recipeItem.unit?.name,
  //     },

  //     newData: {
  //       rawMaterialId: updatedRecipeItem.rawMaterialId,

  //       rawMaterialName: updatedRecipeItem.rawMaterial.name,

  //       inputQuantity,

  //       inputUnitId,

  //       inputUnitName: updatedRecipeItem.unit?.name,

  //       quantity: baseQuantity,

  //       baseUnitId: updatedRecipeItem.rawMaterial.unitId,

  //       baseUnitName: updatedRecipeItem.rawMaterial.unit.name,

  //       conversionFactor,

  //       conversionSource,
  //     },
  //   });

  //   return updatedRecipeItem;
  // }

  // ===========================================================
  // REMOVE SINGLE ITEM
  // ===========================================================

  async remove(
    currentUser: AuthenticatedUser,
    productId: string,
    itemId: string,
  ) {
    const tenantId = getTenantId(currentUser);

    const recipeItem = await this.prisma.recipeItem.findFirst({
      where: {
        id: itemId,

        productId,

        product: {
          tenantId,
        },
      },

      include: {
        product: true,

        rawMaterial: {
          include: {
            unit: true,
          },
        },
      },
    });

    if (!recipeItem) {
      throw new NotFoundException('Recipe item tidak ditemukan');
    }

    // =========================================================
    // DELETE
    // =========================================================

    await this.prisma.recipeItem.delete({
      where: {
        id: itemId,
      },
    });

    // =========================================================
    // AUDIT LOG
    // =========================================================

    await this.auditLogService.create({
      tenantId,

      userId: currentUser.userId,

      action: AuditLogAction.DELETE,

      module: 'RECIPE',

      entityType: 'RecipeItem',

      entityId: recipeItem.id,

      description: `Bahan "${recipeItem.rawMaterial.name}" dihapus dari recipe "${recipeItem.product.name}"`,

      oldData: {
        id: recipeItem.id,

        productId: recipeItem.productId,

        productName: recipeItem.product.name,

        rawMaterialId: recipeItem.rawMaterialId,

        rawMaterialName: recipeItem.rawMaterial.name,

        quantity: Number(recipeItem.quantity),
      },
    });

    return {
      message: 'Recipe item berhasil dihapus',
    };
  }
}
