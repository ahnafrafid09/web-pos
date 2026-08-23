import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';

import { User } from 'src/generated/prisma/client';
import { AuditLogAction } from 'src/generated/prisma/enums';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // =========================================================
  // REGISTER TENANT
  // =========================================================

  async registerTenant(
    dto: RegisterTenantDto,
    meta?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    // Cek apakah slug tenant sudah digunakan
    const existingTenant = await this.prisma.tenant.findUnique({
      where: {
        slug: dto.tenantSlug,
      },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant slug sudah digunakan');
    }

    // Cek email
    const existingEmail = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (existingEmail) {
      throw new ConflictException('Email sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    /**
     * Tenant + OWNER harus dibuat dalam satu transaction.
     */
    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          slug: dto.tenantSlug,
          status: true,
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: dto.ownerName,
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
          role: 'OWNER',
          status: true,
        },
      });

      return {
        tenant,
        user,
      };
    });

    // Audit register
    await this.auditLogService.create({
      tenantId: result.tenant.id,
      userId: result.user.id,

      action: AuditLogAction.REGISTER,

      module: 'AUTH',

      entityType: 'Tenant',
      entityId: result.tenant.id,

      description: `Tenant "${result.tenant.name}" berhasil didaftarkan`,
    });

    return {
      message: 'Tenant berhasil didaftarkan',

      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
      },

      owner: {
        id: result.user.id,
        name: result.user.name,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
      },
    };
  }

  // =========================================================
  // LOGIN
  // =========================================================

  async login(
    dto: LoginDto,
    meta?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      include: {
        tenant: true,
      },
    });

    // =====================================================
    // USER TIDAK DITEMUKAN
    // =====================================================

    if (!user) {
      await this.createLoginAuditLog({
        action: AuditLogAction.LOGIN_FAILED,

        description: 'Percobaan login gagal: email tidak ditemukan',

        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      });

      throw new UnauthorizedException('Email atau password salah');
    }

    // =====================================================
    // PASSWORD SALAH
    // =====================================================

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      await this.createLoginAuditLog({
        userId: user.id,
        tenantId: user.tenantId,

        action: AuditLogAction.LOGIN_FAILED,

        description: 'Percobaan login gagal: password salah',

        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      });

      throw new UnauthorizedException('Email atau password salah');
    }

    // =====================================================
    // USER TIDAK AKTIF
    // =====================================================

    if (!user.status) {
      await this.createLoginAuditLog({
        userId: user.id,
        tenantId: user.tenantId,

        action: AuditLogAction.LOGIN_FAILED,

        description: 'Percobaan login gagal: akun tidak aktif',

        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      });

      throw new UnauthorizedException('Akun tidak aktif');
    }

    // =====================================================
    // VALIDASI SUPER ADMIN
    // =====================================================

    if (user.role === 'SUPER_ADMIN') {
      if (user.tenantId !== null) {
        await this.createLoginAuditLog({
          userId: user.id,
          tenantId: user.tenantId,

          action: AuditLogAction.LOGIN_FAILED,

          description: 'Percobaan login gagal: data SUPER_ADMIN tidak valid',

          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        });

        throw new UnauthorizedException('Data SUPER_ADMIN tidak valid');
      }
    }

    // =====================================================
    // VALIDASI OWNER / ADMIN / CASHIER
    // =====================================================
    else {
      if (!user.tenantId || !user.tenant) {
        await this.createLoginAuditLog({
          userId: user.id,
          tenantId: user.tenantId,

          action: AuditLogAction.LOGIN_FAILED,

          description: 'Percobaan login gagal: tenant tidak ditemukan',

          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        });

        throw new UnauthorizedException('Tenant tidak ditemukan');
      }

      if (!user.tenant.status) {
        await this.createLoginAuditLog({
          userId: user.id,
          tenantId: user.tenantId,

          action: AuditLogAction.LOGIN_FAILED,

          description: 'Percobaan login gagal: tenant tidak aktif',

          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        });

        throw new UnauthorizedException('Tenant tidak aktif');
      }
    }

    // =====================================================
    // GENERATE TOKEN
    // =====================================================

    const accessToken = await this.generateAccessToken(user);

    const refreshToken = await this.generateRefreshToken(user);

    // Simpan refresh token
    await this.saveRefreshToken(user.id, refreshToken);

    // =====================================================
    // AUDIT LOGIN BERHASIL
    // =====================================================

    await this.createLoginAuditLog({
      userId: user.id,
      tenantId: user.tenantId,

      action: AuditLogAction.LOGIN,

      description: `User "${user.username}" berhasil login`,

      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
      message: 'Login berhasil',

      accessToken,
      refreshToken,

      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,

        tenantId: user.tenantId,

        tenant: user.tenant
          ? {
              id: user.tenant.id,
              name: user.tenant.name,
              slug: user.tenant.slug,
            }
          : null,
      },
    };
  }

  // =========================================================
  // LOGIN AUDIT HELPER
  // =========================================================

  private async createLoginAuditLog(params: {
    userId?: string | null;
    tenantId?: string | null;

    action: AuditLogAction;

    description: string;

    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    await this.auditLogService.create({
      userId: params.userId,
      tenantId: params.tenantId,

      action: params.action,

      module: 'AUTH',

      entityType: 'User',
      entityId: params.userId,

      description: params.description,

      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  // =========================================================
  // ACCESS TOKEN
  // =========================================================

  private async generateAccessToken(user: {
    id: string;
    tenantId: string | null;
    role: string;
  }) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        tenantId: user.tenantId,
        role: user.role,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );
  }

  // =========================================================
  // REFRESH TOKEN
  // =========================================================

  private async generateRefreshToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  // =========================================================
  // SAVE REFRESH TOKEN
  // =========================================================

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const tokenHash = this.hashRefreshToken(refreshToken);

    const expiresAt = this.getRefreshTokenExpiresAt();

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
  }

  // =========================================================
  // REFRESH TOKEN EXPIRES
  // =========================================================

  private getRefreshTokenExpiresAt(): Date {
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new Error('JWT_REFRESH_EXPIRES_IN tidak valid');
    }

    const value = Number(match[1]);

    const unit = match[2] as 's' | 'm' | 'h' | 'd';

    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }

  // =========================================================
  // HASH REFRESH TOKEN
  // =========================================================

  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // =========================================================
  // ME
  // =========================================================

  async me(user: { userId: string; tenantId: string | null; role: string }) {
    const data = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      include: {
        tenant: true,
      },
    });

    if (!data) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    if (!data.status) {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    // SUPER ADMIN tidak memiliki tenant
    if (data.role === 'SUPER_ADMIN') {
      return {
        user: {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role,
          tenantId: null,
        },

        tenant: null,
      };
    }

    if (!data.tenant) {
      throw new UnauthorizedException('Tenant tidak ditemukan');
    }

    // Tenant tidak aktif
    if (!data.tenant.status) {
      throw new UnauthorizedException('Tenant tidak aktif');
    }

    return {
      user: {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        tenantId: data.tenantId,
      },

      tenant: {
        id: data.tenant.id,
        name: data.tenant.name,
        slug: data.tenant.slug,
      },
    };
  }

  // =========================================================
  // REFRESH
  // =========================================================

  async refresh(refreshToken: string) {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokenHash = this.hashRefreshToken(refreshToken);

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: {
          tokenHash,
        },

        include: {
          user: {
            include: {
              tenant: true,
            },
          },
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token tidak ditemukan');
      }

      if (storedToken.revokedAt) {
        throw new UnauthorizedException('Refresh token sudah dicabut');
      }

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token sudah expired');
      }

      const user = storedToken.user;

      // Cek user masih aktif
      if (!user.status) {
        throw new UnauthorizedException('Akun tidak aktif');
      }

      // Kalau bukan SUPER_ADMIN,
      // tenant harus aktif
      if (user.role !== 'SUPER_ADMIN') {
        if (!user.tenant || !user.tenant.status) {
          throw new UnauthorizedException('Tenant tidak aktif');
        }
      }

      const accessToken = await this.generateAccessToken(user);

      return {
        accessToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Refresh token tidak valid atau sudah expired',
      );
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async logout(
    userId: string,
    refreshToken: string,
    meta?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    const tokenHash = this.hashRefreshToken(refreshToken);

    const token = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        userId,
        revokedAt: null,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token tidak ditemukan');
    }

    await this.prisma.refreshToken.update({
      where: {
        id: token.id,
      },

      data: {
        revokedAt: new Date(),
      },
    });

    // Ambil data user untuk audit
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        username: true,
        tenantId: true,
      },
    });

    if (user) {
      await this.createLoginAuditLog({
        userId: user.id,
        tenantId: user.tenantId,

        action: AuditLogAction.LOGOUT,

        description: `User "${user.username}" logout`,
      });
    }

    return {
      message: 'Logout berhasil',
    };
  }
}
