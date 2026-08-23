import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductType } from '../../generated/prisma/client';

export class CreateProductDto {
  @ApiProperty({
    example: 'Beras Premium',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'uuid-category',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    enum: ProductType,
    example: ProductType.MENU,
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiPropertyOptional({
    example: 'BRS-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiProperty({
    example: 'kg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  unit: string;

  @ApiPropertyOptional({
    example: 15000,
    description: 'Wajib untuk MENU dan MERCHANDISE',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPrice?: number;
}
