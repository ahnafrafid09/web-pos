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
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { CategoryService } from './category.service';
import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ModuleCode, UserRole } from '../../../generated/prisma/enums';
import { QueryCategoryDto } from './dto/category-query';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateCategoryStatus } from './dto/update-category-status';
import { ModuleAccessGuard } from '../../../module-access/module-access/module-access.guard';
import { RequireModule } from '../../../module-access/decorators/require-module.decorator';

@ApiTags('Master Data / Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, ModuleAccessGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(UserRole.OWNER || UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Category',
    description:
      'OWNER membuat category baru untuk tenant sendiri. Role yang diperbolehkan adalah ADMIN dan CASHIER.',
  })
  @ApiResponse({
    status: 201,
    description: 'Category berhasil dibuat',
  })
  @ApiResponse({
    status: 400,
    description: 'Data Category tidak valid',
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
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.create(currentUser, dto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Category',
    description: 'OWNER melihat semua category untuk tenant sendiri',
  })
  @ApiResponse({
    status: 200,
    description: 'Data category berhasil diambil',
  })
  @ApiResponse({
    status: 404,
    description: 'Data category tidak ada',
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid atau user belum login',
  })
  @ApiResponse({
    status: 403,
    description: 'User tidak memiliki permission',
  })
  async findAll(
    @Query()
    dto: QueryCategoryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.categoryService.findAll(dto, currentUser);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Category By Id',
    description: 'OWNER melihat category by id untuk tenant sendiri',
  })
  @ApiResponse({
    status: 200,
    description: 'Data category berhasil diambil',
  })
  @ApiResponse({
    status: 404,
    description: 'Data category tidak ada',
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid atau user belum login',
  })
  @ApiResponse({
    status: 403,
    description: 'User tidak memiliki permission',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.categoryService.findOne(currentUser, id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update category',
    description: 'OWNER melihat update data category untuk tenant sendiri',
  })
  @ApiResponse({
    status: 200,
    description: 'Data category berhasil diupdate',
  })
  @ApiResponse({
    status: 404,
    description: 'Data category tidak ada',
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid atau user belum login',
  })
  @ApiResponse({
    status: 403,
    description: 'User tidak memiliki permission',
  })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    return this.categoryService.update(currentUser, dto, id);
  }

  @Patch(':id/status')
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update category status',
    description:
      'OWNER dapat mengaktifkan atau menonaktifkan category dalam tenant sendiri.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status category berhasil diperbarui',
  })
  @ApiResponse({
    status: 404,
    description: 'User tidak ditemukan',
  })
  async updateStatus(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryStatus,
  ) {
    return this.categoryService.updateStatus(currentUser, id, dto);
  }
}
