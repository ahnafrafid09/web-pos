import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TransactionSettingService } from './transaction-setting.service';
import { UpdateTransactionSettingDto } from './dto/update-transaction-setting.dto';
import { TransactionSettingResponseDto } from './dto/transaction-setting-response.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Transaction Settings')
@ApiBearerAuth()
@Controller('transaction-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionSettingController {
  constructor(
    private readonly transactionSettingService: TransactionSettingService,
  ) {}

  @Get()
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get transaction settings',
    description:
      'Mengambil pengaturan transaksi berdasarkan tenant user yang sedang login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction settings berhasil diambil.',
    type: TransactionSettingResponseDto,
  })
  async findOne(@CurrentUser() user: AuthenticatedUser) {
    return this.transactionSettingService.findOne(user);
  }

  @Patch()
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update transaction settings',
    description: 'Mengubah pengaturan tax dan service charge untuk tenant.',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction settings berhasil diperbarui.',
    type: TransactionSettingResponseDto,
  })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateTransactionSettingDto,
  ) {
    return this.transactionSettingService.update(user, dto);
  }
}
