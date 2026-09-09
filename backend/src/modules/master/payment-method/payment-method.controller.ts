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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { QueryPaymentMethodDto } from './dto/payment-method-query.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { UpdatePaymentMethodStatusDto } from './dto/update-payment-method-status';

@ApiTags('Master Data / Payment Method')
@ApiBearerAuth('access-token')
@Controller('payment-method')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  @Roles(UserRole.OWNER || UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Payment Method',
    description:
      'OWNER membuat metode pembayaran baru untuk tenant sendiri. Role yang diperbolehkan adalah ADMIN dan CASHIER.',
  })
  @ApiResponse({
    status: 201,
    description: 'metode pembayaran berhasil dibuat',
  })
  @ApiResponse({
    status: 400,
    description: 'Data metode pembayaran tidak valid',
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
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodService.create(currentUser, dto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Payment Method',
    description: 'OWNER melihat semua Payment Method untuk tenant sendiri',
  })
  @ApiResponse({
    status: 200,
    description: 'Data Payment Method berhasil diambil',
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
    dto: QueryPaymentMethodDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.paymentMethodService.findAll(dto, currentUser);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Payment Method By Id',
    description: 'OWNER melihat Payment Method by id untuk tenant sendiri',
  })
  @ApiResponse({
    status: 200,
    description: 'Data Payment Method berhasil diambil',
  })
  @ApiResponse({
    status: 404,
    description: 'Data Payment Method tidak ada',
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
    return this.paymentMethodService.findOne(currentUser, id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Payment Method',
    description:
      'OWNER melihat update data Payment Method untuk tenant sendiri',
  })
  @ApiResponse({
    status: 200,
    description: 'Data Payment Method berhasil diupdate',
  })
  @ApiResponse({
    status: 404,
    description: 'Data Payment Method tidak ada',
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
    @Body() dto: UpdatePaymentMethodDto,
    @Param('id') id: string,
  ) {
    return this.paymentMethodService.update(currentUser, dto, id);
  }

  @Patch(':id/status')
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Payment Method status',
    description:
      'OWNER dapat mengaktifkan atau menonaktifkan Payment Method dalam tenant sendiri.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status Payment Method berhasil diperbarui',
  })
  @ApiResponse({
    status: 404,
    description: 'User tidak ditemukan',
  })
  async updateStatus(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdatePaymentMethodStatusDto,
  ) {
    return this.paymentMethodService.updateStatus(currentUser, id, dto);
  }
}
