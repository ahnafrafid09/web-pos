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
import { CashierService } from './cashier.service';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';
import { CheckoutCashierDto } from './dto/checkout-cashier-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ListProductCashierDto } from './dto/list-product-cashier-dto';
// import { CreateCashierDto } from './dto/checkout-cashier-dto';
// import { UpdateCashierDto } from './dto/update-cashier.dto';

@ApiTags('Transaction / Cashier')
@ApiBearerAuth()
@Controller('cashier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashierController {
  constructor(private readonly cashierService: CashierService) {}

  @Post()
  @Roles('CASHIER', 'OWNER')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'API untuk kasir',
  })
  checkout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CheckoutCashierDto,
  ) {
    return this.cashierService.checkout(user, dto);
  }

  @Get('/list-products')
  @Roles('OWNER', 'ADMIN', 'CASHIER')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mendapatkan daftar produk',
  })
  async findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: ListProductCashierDto,
  ) {
    return this.cashierService.listProduct(currentUser, query);
  }

  // @Post()
  // create(@Body() createCashierDto: CreateCashierDto) {
  //   return this.cashierService.create(createCashierDto);
  // }

  // @Get()
  // findAll() {
  //   return this.cashierService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cashierService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCashierDto: UpdateCashierDto) {
  //   return this.cashierService.update(+id, updateCashierDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cashierService.remove(+id);
  // }
}
