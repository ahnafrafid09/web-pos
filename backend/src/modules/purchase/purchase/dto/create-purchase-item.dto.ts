import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID raw material',
  })
  @IsUUID()
  rawMaterialId: string;

  @ApiProperty({
    example: 5,
    description: 'Jumlah yang dibeli',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Unit saat pembelian',
  })
  @IsUUID()
  unitId: string;

  @ApiProperty({
    example: 50000,
    description: 'Harga per unit pembelian',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  unitPrice: number;
}
