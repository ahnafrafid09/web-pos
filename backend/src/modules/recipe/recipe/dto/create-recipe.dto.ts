import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class RecipeItemDto {
  @ApiProperty({
    description: 'ID raw material yang digunakan dalam recipe',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  rawMaterialId: string;

  @ApiProperty({
    description:
      'Jumlah raw material berdasarkan unit yang dipilih pada unitId',
    example: 150,
    minimum: 0.001,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiProperty({
    description:
      'ID unit yang digunakan saat memasukkan quantity. Sistem akan melakukan konversi otomatis ke base unit raw material.',
    format: 'uuid',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  unitId: string;
}

export class CreateRecipeDto {
  @ApiProperty({
    description: 'Daftar bahan baku yang digunakan untuk membuat satu produk',
    type: [RecipeItemDto],
    minItems: 1,

    example: [
      {
        rawMaterialId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 150,
        unitId: '660e8400-e29b-41d4-a716-446655440000',
      },
      {
        rawMaterialId: '770e8400-e29b-41d4-a716-446655440000',
        quantity: 20,
        unitId: '880e8400-e29b-41d4-a716-446655440000',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeItemDto)
  items: RecipeItemDto[];
}
