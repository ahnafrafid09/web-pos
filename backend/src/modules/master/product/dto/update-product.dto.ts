import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ProductType } from '../../../../generated/prisma/client';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Ayam Geprek Spesial',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({
    example: 'uuid-category',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: ProductType,
    example: ProductType.MENU,
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiPropertyOptional({
    example: 'AYAM-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({
    example: 'porsi',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unit?: string;

  @ApiPropertyOptional({
    example: 18000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sellingPrice?: number;

  @ApiPropertyOptional({
    example: 12000,
    description: 'Wajib untuk MENU dan MERCHANDISE',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hpp?: number;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  status?: boolean;
}
