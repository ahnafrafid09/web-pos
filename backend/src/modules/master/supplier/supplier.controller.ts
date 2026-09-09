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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { SupplierQueryDto } from './dto/supplier-query.dto';
import { UpdateSupplierStatusDto } from './dto/update-supplier-status.dto';

@ApiTags('Master Data / Supplier')
@ApiBearerAuth()
@Controller('supplier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Membuat supplier baru',
  })
  async create(@CurrentUser() user: any, @Body() dto: CreateSupplierDto) {
    return this.supplierService.create(user, dto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mengambil semua data supplier',
  })
  findAll(@CurrentUser() user: any, @Query() query: SupplierQueryDto) {
    return this.supplierService.findAll(query, user);
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mengambil data supplier berdasarkan id',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.supplierService.findOne(user, id);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update data supplier',
  })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(user, updateSupplierDto, id);
  }

  @Patch(':id/status')
  @Roles('OWNER', 'ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update status data supplier',
  })
  updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateSupplierStatusDto,
  ) {
    return this.supplierService.updateStatus(user, id, dto);
  }
}
