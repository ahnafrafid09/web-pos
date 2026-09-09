import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsNumber,
} from 'class-validator';
import { RawMaterialConversionDto } from './raw-material-conversion.dto';

export class CreateRawMaterialDto {
  @ApiProperty({
    example: 'Beras',
    description: 'Nama bahan baku',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 'BB-001',
    description: 'SKU bahan baku',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiProperty({
    example: 'uuid-unit-kg',
    description: 'Unit dasar bahan baku',
  })
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @ApiPropertyOptional({
    example: 15000,
    description: 'Harga modal rata-rata per unit dasar',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averageCost?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Minimum stok sebelum dianggap menipis',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumStock?: number;

  @ApiPropertyOptional({
    type: [RawMaterialConversionDto],
    description: 'Daftar kemasan pembelian khusus untuk bahan baku',
    example: [
      {
        unitId: 'uuid-renceng',
        factor: 10,
      },
      {
        unitId: 'uuid-dus',
        factor: 200,
      },
    ],
  })
  @IsOptional()
  conversions?: RawMaterialConversionDto[];
}
