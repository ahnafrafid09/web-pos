import { Type } from 'class-transformer';

import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  AdjustmentType,
  PurchaseType,
} from '../../../../generated/prisma/enums';

import { CreatePurchaseItemDto } from './create-purchase-item.dto';

export class CreatePurchaseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  supplierId: string;

  @ApiPropertyOptional({
    example: 'INV-001',
  })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({
    enum: PurchaseType,
    example: PurchaseType.DIRECT,
  })
  @IsEnum(PurchaseType)
  purchaseType: PurchaseType;

  @ApiProperty({
    example: '2026-08-24',
  })
  @IsDateString()
  purchaseDate: string;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  discountValue?: number;

  @ApiProperty({
    enum: AdjustmentType,
    example: AdjustmentType.FIXED,
  })
  @IsOptional()
  @IsEnum(AdjustmentType)
  discountType?: AdjustmentType;

  @ApiProperty({
    enum: AdjustmentType,
    example: AdjustmentType.FIXED,
  })
  @IsOptional()
  @IsEnum(AdjustmentType)
  taxType?: AdjustmentType;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  taxValue?: number;

  @ApiPropertyOptional({
    example: 'Belanja bahan pagi',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    type: [CreatePurchaseItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items: CreatePurchaseItemDto[];
}
