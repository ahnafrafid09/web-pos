import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { PurchaseQueryDto } from './dto/purchase-query.dto';

@ApiTags('Transaction / Purchase')
@ApiBearerAuth()
@Controller('purchase')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Membuat transaksi pembelian baru',
  })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createPurchaseDto: CreatePurchaseDto,
  ) {
    return this.purchaseService.create(user, createPurchaseDto);
  }
  @Get()
  @ApiOperation({
    summary: 'Daftar purchase',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil daftar purchase',
  })
  findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: PurchaseQueryDto,
  ) {
    return this.purchaseService.findAll(currentUser, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Daftar purchase by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil data purchase by id',
  })
  findOne(
    @Param('id') id: string,
    @CurrentUser() CurrentUser: AuthenticatedUser,
  ) {
    return this.purchaseService.findOne(CurrentUser, id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePurchaseDto: UpdatePurchaseDto,
  // ) {
  //   return this.purchaseService.update(+id, updatePurchaseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.purchaseService.remove(+id);
  // }
}
