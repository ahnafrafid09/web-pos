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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

@ApiTags('Master Data / Product')
@ApiBearerAuth()
@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Membuat produk baru',
  })
  async create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
    return this.productService.create(user, dto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'CASHIER')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mendapatkan daftar produk',
  })
  async findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: ProductQueryDto,
  ) {
    return this.productService.findAll(currentUser, query);
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN', 'CASHIER')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mendapatkan detail produk',
  })
  @ApiParam({
    name: 'id',
    example: 'uuid-product',
  })
  async findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.productService.findOne(currentUser, id);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Memperbarui produk',
  })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(currentUser, id, dto);
  }

  @Patch(':id/status')
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update product status',
    description:
      'OWNER dapat mengaktifkan atau menonaktifkan product dalam tenant sendiri.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status product berhasil diperbarui',
  })
  @ApiResponse({
    status: 404,
    description: 'User tidak ditemukan',
  })
  async updateStatus(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateProductStatusDto,
  ) {
    return this.productService.updateStatus(currentUser, id, dto);
  }
}
