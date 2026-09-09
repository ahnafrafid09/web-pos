import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuditLogAction, Prisma } from 'src/generated/prisma/client';
import { UserRole } from 'src/generated/prisma/enums';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

import { UserQueryDto } from './dto/user-query.dto';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // =========================================================
  // CREATE USER
  // =========================================================

  async create(currentUser: AuthenticatedUser, dto: CreateUserDto) {
    if (!currentUser.tenantId) {
      throw new ConflictException('User tidak memiliki tenant');
    }

    if (dto.role !== UserRole.ADMIN && dto.role !== UserRole.CASHIER) {
      throw new ConflictException(
        'OWNER hanya dapat membuat ADMIN atau CASHIER',
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        tenantId: currentUser.tenantId,

        OR: [
          {
            username: dto.username,
          },
          {
            email: dto.email,
          },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username atau email sudah digunakan');
    }

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId: currentUser.tenantId,
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password,
        role: dto.role,
      },
    });

    // =====================================================
    // AUDIT LOG
    // =====================================================

    await this.auditLogService.create({
      tenantId: currentUser.tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.CREATE,

      module: 'USER',

      entityType: 'User',
      entityId: user.id,

      description: `User "${user.username}" berhasil dibuat`,

      newData: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

    return this.toResponse(user);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(query: UserQueryDto, currentUser: AuthenticatedUser) {
    if (!currentUser.tenantId) {
      throw new ConflictException('User tidak memiliki tenant');
    }

    const tenantId = currentUser.tenantId;

    const { page = 1, limit = 10, search, role, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
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

    if (role !== undefined) {
      where.role = role;
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      data: users.map((user) => this.toResponse(user)),

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
    if (!currentUser.tenantId) {
      throw new ConflictException('User tidak memiliki tenant');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return this.toResponse(user);
  }

  // =========================================================
  // UPDATE USER
  // =========================================================

  async update(currentUser: AuthenticatedUser, id: string, dto: UpdateUserDto) {
    if (!currentUser.tenantId) {
      throw new ConflictException('User tidak memiliki tenant');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const data: Prisma.UserUpdateInput = {
      ...(dto.name !== undefined && {
        name: dto.name,
      }),

      ...(dto.username !== undefined && {
        username: dto.username,
      }),

      ...(dto.email !== undefined && {
        email: dto.email,
      }),

      ...(dto.role !== undefined && {
        role: dto.role,
      }),
    };

    // Password hanya di-update,
    // TIDAK PERNAH dimasukkan ke audit log.
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },

      data,
    });

    // =====================================================
    // AUDIT LOG
    // =====================================================

    await this.auditLogService.create({
      tenantId: currentUser.tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'USER',

      entityType: 'User',
      entityId: user.id,

      description: `User "${user.username}" berhasil diperbarui`,

      oldData: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },

      newData: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });

    return this.toResponse(updatedUser);
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async updateStatus(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdateUserStatusDto,
  ) {
    if (!currentUser.tenantId) {
      throw new ConflictException('User tidak memiliki tenant');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        status: dto.status,
      },
    });

    // =====================================================
    // AUDIT LOG
    // =====================================================

    await this.auditLogService.create({
      tenantId: currentUser.tenantId,
      userId: currentUser.userId,

      action: AuditLogAction.UPDATE,

      module: 'USER',

      entityType: 'User',
      entityId: user.id,

      description: dto.status
        ? `User "${user.username}" diaktifkan`
        : `User "${user.username}" dinonaktifkan`,

      oldData: {
        status: user.status,
      },

      newData: {
        status: updatedUser.status,
      },
    });

    return {
      message: dto.status
        ? 'User berhasil diaktifkan'
        : 'User berhasil dinonaktifkan',

      user: this.toResponse(updatedUser),
    };
  }

  // =========================================================
  // RESPONSE
  // =========================================================

  private toResponse(user: any) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      tenantId: user.tenantId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
