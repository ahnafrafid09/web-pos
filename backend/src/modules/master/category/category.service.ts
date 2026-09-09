import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/category-query';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateCategoryStatus } from './dto/update-category-status';

import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

import { AuditLogAction, Category, Prisma } from 'src/generated/prisma/client';

import { getTenantId } from 'src/common/utils/tenant.util';

import { AuditLogService } from 'src/audit-log/audit-log.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(currentUser: AuthenticatedUser, dto: CreateCategoryDto) {
    const tenantId = getTenantId(currentUser);

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        tenantId,
      },
    });

    // Audit Log
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.CREATE,

      module: 'CATEGORY',

      entityType: 'Category',
      entityId: category.id,

      description: `Category "${category.name}" berhasil dibuat`,

      newData: {
        id: category.id,
        name: category.name,
        status: category.status,
      },
    });

    return this.toResponse(category);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(query: QueryCategoryDto, currentUser: AuthenticatedUser) {
    const tenantId = getTenantId(currentUser);

    const { page = 1, limit = 10, search, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {
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

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.category.count({
        where,
      }),
    ]);

    return {
      data: categories.map((category) => this.toResponse(category)),

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

    const category = await this.prisma.category.findFirst({
      where: {
        id,
        tenantId,
        status: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category tidak ditemukan');
    }

    return {
      data: this.toResponse(category),
    };
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    currentUser: AuthenticatedUser,
    dto: UpdateCategoryDto,
    id: string,
  ) {
    const tenantId = getTenantId(currentUser);

    const category = await this.prisma.category.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category tidak ditemukan');
    }

    const data: Prisma.CategoryUpdateInput = {
      ...(dto.name !== undefined && {
        name: dto.name,
      }),
    };

    const updatedCategory = await this.prisma.category.update({
      where: {
        id: category.id,
      },

      data,
    });

    // Audit Log
    await this.auditLogService.create({
      tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'CATEGORY',

      entityType: 'Category',
      entityId: category.id,

      description: `Category "${category.name}" berhasil diperbarui`,

      oldData: {
        id: category.id,
        name: category.name,
        status: category.status,
      },

      newData: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        status: updatedCategory.status,
      },
    });

    return this.toResponse(updatedCategory);
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async updateStatus(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdateCategoryStatus,
  ) {
    const tenantId = getTenantId(currentUser);

    const category = await this.prisma.category.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category tidak ditemukan');
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id: category.id,
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

      module: 'CATEGORY',

      entityType: 'Category',
      entityId: category.id,

      description: dto.status
        ? `Category "${category.name}" diaktifkan`
        : `Category "${category.name}" dinonaktifkan`,

      oldData: {
        id: category.id,
        name: category.name,
        status: category.status,
      },

      newData: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        status: updatedCategory.status,
      },
    });

    return {
      message: dto.status
        ? 'Category berhasil diaktifkan'
        : 'Category berhasil dinonaktifkan',

      data: this.toResponse(updatedCategory),
    };
  }

  // =========================================================
  // RESPONSE
  // =========================================================

  private toResponse(category: Category) {
    return {
      id: category.id,
      name: category.name,
      status: category.status,
      tenantId: category.tenantId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
