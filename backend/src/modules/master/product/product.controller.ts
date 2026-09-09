import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { FileInterceptor } from '@nestjs/platform-express';

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Ayam Geprek',
        },
        categoryId: {
          type: 'string',
          example: 'uuid-category',
        },
        type: {
          type: 'string',
          enum: ['MENU', 'MERCHANDISE'],
          example: 'MENU',
        },
        sku: {
          type: 'string',
          example: 'AYAM-001',
        },
        unit: {
          type: 'string',
          example: 'porsi',
        },
        sellingPrice: {
          type: 'number',
          example: 15000,
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productService.create(user, dto, image);
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
    summary: 'Mengubah produk',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Ayam Geprek Spesial',
        },

        categoryId: {
          type: 'string',
          example: 'uuid-category',
        },

        type: {
          type: 'string',
          enum: ['MENU', 'MERCHANDISE'],
          example: 'MENU',
        },

        sku: {
          type: 'string',
          example: 'AYAM-001',
        },

        unit: {
          type: 'string',
          example: 'porsi',
        },

        sellingPrice: {
          type: 'number',
          example: 18000,
        },

        status: {
          type: 'boolean',
          example: true,
        },

        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productService.update(user, id, dto, image);
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
