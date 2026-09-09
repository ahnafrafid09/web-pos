import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';
import { AuthMeResponseDto } from './dto/auth-me-response.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================================================
  // COOKIE CONFIGURATION
  // =========================================================

  private get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Development:
   * Access token  = 2 jam
   * Refresh token = 30 hari
   *
   * Production:
   * Access token  = 15 menit
   * Refresh token = 7 hari
   */
  private get accessTokenMaxAge(): number {
    return this.isProduction
      ? 15 * 60 * 1000 // 15 menit
      : 2 * 60 * 60 * 1000; // 2 jam
  }

  private get refreshTokenMaxAge(): number {
    return this.isProduction
      ? 7 * 24 * 60 * 60 * 1000 // 7 hari
      : 30 * 24 * 60 * 60 * 1000; // 30 hari
  }

  @Post('register-tenant')
  @ApiOperation({
    summary: 'Register tenant dan owner',
    description:
      'Membuat tenant baru sekaligus membuat user dengan role OWNER.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tenant dan owner berhasil dibuat.',
  })
  @ApiResponse({
    status: 409,
    description: 'Tenant slug atau email sudah digunakan.',
  })
  async registerTenant(@Body() dto: RegisterTenantDto, @Req() req: Request) {
    return this.authService.registerTenant(dto, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login sebagai SUPER_ADMIN, OWNER, ADMIN, atau CASHIER.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil.',
  })
  @ApiUnauthorizedResponse({
    description: 'Email atau password salah.',
  })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: this.accessTokenMaxAge,
      path: '/',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: this.refreshTokenMaxAge,
      path: '/',
    });

    /**
     * Token tidak dikirim ke response body.
     *
     * Token disimpan di HTTP-only cookie.
     */
    return {
      message: result.message,
      user: result.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current authenticated user',
    description:
      'Mengambil informasi user yang sedang login berdasarkan access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User berhasil ditemukan.',
    type: AuthMeResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token tidak valid, expired, atau user tidak aktif.',
  })
  async me(@Req() req: AuthenticatedRequest): Promise<AuthMeResponseDto> {
    return this.authService.me(req.user);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Membuat access token baru menggunakan refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token berhasil diperbarui.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Refresh token tidak valid, sudah expired, atau sudah dicabut.',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token tidak ditemukan');
    }

    const result = await this.authService.refresh(refreshToken);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return {
      message: 'Token berhasil diperbarui',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout user dan mencabut refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout berhasil.',
  })
  @ApiUnauthorizedResponse({
    description: 'Access token tidak valid.',
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    try {
      if (refreshToken) {
        await this.authService.logout(user.userId, refreshToken, {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
      }
    } finally {
      // Tetap hapus cookie walaupun revoke gagal
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: this.isProduction,
        sameSite: 'lax',
        path: '/',
      });

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: this.isProduction,
        sameSite: 'lax',
        path: '/',
      });
    }

    return {
      message: 'Logout berhasil',
    };
  }
}
