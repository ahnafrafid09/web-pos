import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuditLogAction, Prisma, Product } from 'src/generated/prisma/client';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { getTenantId } from 'src/common/utils/tenant.util';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(currentUser: AuthenticatedUser, dto: CreateProductDto) {
    const tenantId = getTenantId(currentUser);

    const category = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
        tenantId,
        status: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan atau tidak aktif');
    }

    if (dto.sku) {
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          tenantId,
          sku: dto.sku,
        },
      });

      if (existingProduct) {
        throw new ConflictException('SKU sudah digunakan');
      }
    }

    if (dto.sellingPrice === undefined || dto.sellingPrice <= 0) {
      throw new BadRequestException('Harga jual wajib diisi');
    }

    const product = await this.prisma.product.create({
      data: {
        tenantId,
        categoryId: dto.categoryId,
        name: dto.name,
        type: dto.type,
        sku: dto.sku || null,
        unit: dto.unit,
        sellingPrice: dto.sellingPrice,
      },
      include: {
        category: true,
      },
    });

    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.CREATE,

      module: 'PRODUCT',

      entityType: 'Product',
      entityId: product.id,

      description: `Product "${product.name}" berhasil dibuat`,

      newData: {
        id: product.id,
        name: product.name,
        status: product.status,
      },
    });

    return this.toResponse(product);
  }

  async findAll(currentUser: AuthenticatedUser, query: ProductQueryDto) {
    const tenantId = getTenantId(currentUser);

    const { page = 1, limit = 10, search, type, categoryId, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
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

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status !== undefined) {
      where.status = status;
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products.map((product) => this.toResponse(product)),
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

    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return this.toResponse(product);
  }

  async update(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdateProductDto,
  ) {
    const tenantId = getTenantId(currentUser);

    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          tenantId,
          status: true,
        },
      });

      if (!category) {
        throw new NotFoundException(
          'Kategori tidak ditemukan atau tidak aktif',
        );
      }
    }

    if (dto.sku && dto.sku !== product.sku) {
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          tenantId,
          sku: dto.sku,
          NOT: {
            id,
          },
        },
      });

      if (existingProduct) {
        throw new ConflictException('SKU sudah digunakan');
      }
    }

    let finalSellingPrice = product.sellingPrice;

    if (dto.sellingPrice !== undefined) {
      if (dto.sellingPrice <= 0) {
        throw new BadRequestException('Harga jual harus lebih dari 0');
      }

      finalSellingPrice = dto.sellingPrice;
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),

        ...(dto.categoryId !== undefined && {
          categoryId: dto.categoryId,
        }),

        ...(dto.type !== undefined && {
          type: dto.type,
        }),

        ...(dto.sku !== undefined && {
          sku: dto.sku || null,
        }),

        ...(dto.unit !== undefined && {
          unit: dto.unit,
        }),

        sellingPrice: finalSellingPrice,
      },
      include: {
        category: true,
      },
    });

    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'PRODUCT',

      entityType: 'Product',
      entityId: product.id,

      description: `Product "${product.name}" berhasil diperbarui`,

      oldData: {
        id: product.id,
        name: product.name,
        status: product.status,
      },

      newData: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        status: updatedProduct.status,
      },
    });

    return this.toResponse(updatedProduct);
  }

  async updateStatus(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdateProductStatusDto,
  ) {
    const tenantId = getTenantId(currentUser);

    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        status: dto.status,
      },
      include: {
        category: true,
      },
    });

    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'PRODUCT',

      entityType: 'Product',
      entityId: product.id,

      description: dto.status
        ? `Product "${product.name}" diaktifkan`
        : `Product "${product.name}" dinonaktifkan`,

      oldData: {
        id: product.id,
        name: product.name,
        status: product.status,
      },

      newData: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        status: updatedProduct.status,
      },
    });

    return {
      message: dto.status
        ? 'Product berhasil diaktifkan'
        : 'Product berhasil dinonaktifkan',
      data: this.toResponse(updatedProduct),
    };
  }

  private toResponse(
    product: Product & {
      category?: {
        name: string;
      } | null;
    },
  ) {
    return {
      id: product.id,
      tenantId: product.tenantId,

      categoryId: product.categoryId,

      name: product.name,
      type: product.type,
      sku: product.sku,
      unit: product.unit,

      sellingPrice: product.sellingPrice,

      status: product.status,

      category: product.category
        ? {
            name: product.category.name,
          }
        : null,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
