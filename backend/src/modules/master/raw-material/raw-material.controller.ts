import {
  Body,
  Controller,
  Delete,
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
  ApiTags,
} from '@nestjs/swagger';

import { RawMaterialService } from './raw-material.service';

import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { RawMaterialQueryDto } from './dto/raw-material-query.dto';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Master Data / Raw Material')
@ApiBearerAuth('access-token')
@Controller('raw-material')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RawMaterialController {
  constructor(private readonly rawMaterialService: RawMaterialService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({
    summary: 'Membuat bahan baku baru',
  })
  async create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateRawMaterialDto,
  ) {
    return this.rawMaterialService.create(currentUser, dto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'CASHIER')
  @ApiOperation({
    summary: 'Mendapatkan daftar bahan baku',
  })
  async findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: RawMaterialQueryDto,
  ) {
    return this.rawMaterialService.findAll(currentUser, query);
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN', 'CASHIER')
  @ApiOperation({
    summary: 'Mendapatkan detail bahan baku',
  })
  @ApiParam({
    name: 'id',
    description: 'ID bahan baku',
    example: '88aede01-2662-4231-9c79-177e90fdf0e9',
  })
  async findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.rawMaterialService.findOne(currentUser, id);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({
    summary: 'Memperbarui bahan baku',
  })
  @ApiParam({
    name: 'id',
    description: 'ID bahan baku',
    example: '88aede01-2662-4231-9c79-177e90fdf0e9',
  })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateRawMaterialDto,
  ) {
    return this.rawMaterialService.update(currentUser, id, dto);
  }

  @Patch(':id/status')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({
    summary: 'Menonaktifkan bahan baku',
  })
  @ApiParam({
    name: 'id',
    description: 'ID bahan baku',
    example: '88aede01-2662-4231-9c79-177e90fdf0e9',
  })
  async remove(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.rawMaterialService.updateStatus(currentUser, id, false);
  }
}
