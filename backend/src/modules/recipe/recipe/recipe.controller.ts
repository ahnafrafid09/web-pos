import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RecipeService } from './recipe.service';

import { CreateRecipeDto } from './dto/create-recipe.dto';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { RequireModule } from '../../../module-access/decorators/require-module.decorator';
import { ModuleCode } from '../../../generated/prisma/enums';
import { ModuleAccessGuard } from '../../../module-access/module-access/module-access.guard';

@ApiTags('Product / Recipe')
@ApiBearerAuth()
@Controller('product/:productId/recipe')
@RequireModule(ModuleCode.RECIPE)
@UseGuards(JwtAuthGuard, RolesGuard, ModuleAccessGuard)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}
  @Post()
  @ApiOperation({
    summary: 'Tambah bahan ke recipe product',
    description:
      'Menambahkan raw material ke recipe sebuah product MENU. Quantity akan dikonversi otomatis ke base unit Raw Material.',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID product yang akan dibuatkan recipe',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Recipe item berhasil ditambahkan',
  })
  @ApiResponse({
    status: 400,
    description:
      'Product bukan MENU, raw material sudah ada, atau konversi unit tidak ditemukan',
  })
  @ApiResponse({
    status: 404,
    description: 'Product atau raw material tidak ditemukan',
  })
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipeService.create(currentUser, productId, createRecipeDto);
  }

  @Put()
  updateRecipe(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('productId') productId: string,
    @Body() dto: CreateRecipeDto,
  ) {
    return this.recipeService.updateRecipe(currentUser, productId, dto);
  }

  /**
   * Mendapatkan seluruh recipe dari product
   */
  @Get()
  @ApiOperation({
    summary: 'Mendapatkan recipe product',
    description:
      'Mengambil seluruh raw material yang digunakan oleh sebuah product MENU.',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID product',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Recipe product berhasil diambil',
  })
  @ApiResponse({
    status: 404,
    description: 'Product tidak ditemukan',
  })
  findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.recipeService.findAll(currentUser, productId);
  }

  /**
   * Mendapatkan satu recipe item
   */
  @Get(':itemId')
  @ApiOperation({
    summary: 'Mendapatkan detail recipe item',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID product',
    format: 'uuid',
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID recipe item',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Recipe item berhasil diambil',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe item tidak ditemukan',
  })
  findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.recipeService.findOne(currentUser, productId, itemId);
  }

  /**
   * Update recipe item
   */
  // @Patch(':itemId')
  // @ApiOperation({
  //   summary: 'Update recipe item',
  //   description:
  //     'Mengubah raw material atau quantity recipe. Quantity akan dikonversi otomatis ke base unit Raw Material.',
  // })
  // @ApiParam({
  //   name: 'productId',
  //   description: 'ID product',
  //   format: 'uuid',
  // })
  // @ApiParam({
  //   name: 'itemId',
  //   description: 'ID recipe item',
  //   format: 'uuid',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Recipe item berhasil diperbarui',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Data tidak valid atau konversi unit tidak ditemukan',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Recipe item tidak ditemukan',
  // })
  // update(
  //   @CurrentUser() currentUser: AuthenticatedUser,
  //   @Param('productId', ParseUUIDPipe) productId: string,
  //   @Param('itemId', ParseUUIDPipe) itemId: string,
  //   @Body() updateRecipeDto: UpdateRecipeDto,
  // ) {
  //   return this.recipeService.update(
  //     currentUser,
  //     productId,
  //     itemId,
  //     updateRecipeDto,
  //   );
  // }

  /**
   * Hapus recipe item
   */
  @Delete(':itemId')
  @ApiOperation({
    summary: 'Hapus recipe item',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID product',
    format: 'uuid',
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID recipe item',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Recipe item berhasil dihapus',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe item tidak ditemukan',
  })
  remove(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.recipeService.remove(currentUser, productId, itemId);
  }
}
