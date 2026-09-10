import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import {
  PurchaseStatus,
  PurchaseType,
} from '../../../../generated/prisma/enums';

export class PurchaseQueryDto {
  // =========================================================
  // PAGINATION
  // =========================================================

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Halaman yang ingin diambil',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Jumlah data per halaman',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  // =========================================================
  // SEARCH
  // =========================================================

  @ApiPropertyOptional({
    example: 'PUR-20260825',
    description:
      'Cari berdasarkan nomor purchase, nomor invoice, atau nama supplier',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // =========================================================
  // FILTER STATUS
  // =========================================================

  @ApiPropertyOptional({
    enum: PurchaseStatus,
    example: PurchaseStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  // =========================================================
  // FILTER TYPE
  // =========================================================

  @ApiPropertyOptional({
    enum: PurchaseType,
    example: PurchaseType.DIRECT,
  })
  @IsOptional()
  @IsEnum(PurchaseType)
  purchaseType?: PurchaseType;

  // =========================================================
  // FILTER SUPPLIER
  // =========================================================

  @ApiPropertyOptional({
    example: '8ce23cfb-451f-4ee7-a31b-b968cb7170f7',
  })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  // =========================================================
  // FILTER TANGGAL
  // =========================================================

  @ApiPropertyOptional({
    example: '2026-08-01',
    description: 'Tanggal awal pembelian',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-08-31',
    description: 'Tanggal akhir pembelian',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
