import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

// import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UserRole } from 'src/generated/prisma/enums';
import { UserQueryDto } from './dto/user-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@ApiTags('Master Data / Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * CREATE USER
   *
   * OWNER dapat membuat ADMIN dan CASHIER.
   */
  @Post()
  @Roles(UserRole.OWNER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create user',
    description:
      'OWNER membuat user baru untuk tenant sendiri. Role yang diperbolehkan adalah ADMIN dan CASHIER.',
  })
  @ApiResponse({
    status: 201,
    description: 'User berhasil dibuat',
  })
  @ApiResponse({
    status: 400,
    description: 'Data user tidak valid',
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid atau user belum login',
  })
  @ApiResponse({
    status: 403,
    description: 'User tidak memiliki permission',
  })
  async create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(currentUser, dto);
  }

  /**
   * LIST USER
   *
   * OWNER dan ADMIN dapat melihat user dalam tenantnya.
   */
  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Mengambil semua user yang berada di tenant user yang sedang login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar user berhasil diambil',
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid',
  })
  @ApiResponse({
    status: 403,
    description: 'Tidak memiliki permission',
  })
  async findAll(
    @Query()
    dto: UserQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.findAll(dto, currentUser);
  }

  /**
   * GET USER BY ID
   */
  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Mengambil detail user berdasarkan ID dan tetap dibatasi oleh tenant.',
  })
  @ApiResponse({
    status: 200,
    description: 'User ditemukan',
  })
  @ApiResponse({
    status: 404,
    description: 'User tidak ditemukan',
  })
  async findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(currentUser, id);
  }

  /**
   * UPDATE USER
   *
   * OWNER dapat mengubah user.
   */
  @Patch(':id')
  @Roles(UserRole.OWNER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user',
    description: 'OWNER mengubah data user yang berada di tenant sendiri.',
  })
  @ApiResponse({
    status: 200,
    description: 'User berhasil diperbarui',
  })
  @ApiResponse({
    status: 404,
    description: 'User tidak ditemukan',
  })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(currentUser, id, dto);
  }

  /**
   * ENABLE / DISABLE USER
   */
  @Patch(':id/status')
  @Roles(UserRole.OWNER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user status',
    description:
      'OWNER dapat mengaktifkan atau menonaktifkan user dalam tenant sendiri.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status user berhasil diperbarui',
  })
  @ApiResponse({
    status: 404,
    description: 'User tidak ditemukan',
  })
  async updateStatus(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(currentUser, id, dto);
  }
}
