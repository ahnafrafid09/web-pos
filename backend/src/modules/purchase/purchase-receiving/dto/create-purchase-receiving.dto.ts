import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseReceivingItemDto {
  @ApiProperty({
    example: 'purchase-item-uuid',
    description: 'ID PurchaseItem yang diterima',
  })
  @IsUUID()
  @IsNotEmpty()
  purchaseItemId: string;

  @ApiProperty({
    example: 50,
    description: 'Jumlah barang yang diterima dalam unit pembelian',
  })
  @IsNumber()
  @Min(0.001)
  quantity: number;
}

export class CreatePurchaseReceivingDto {
  @ApiPropertyOptional({
    example: 'Barang datang sebagian dari supplier',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    example: '2026-08-25',
    description:
      'Tanggal penerimaan. Jika tidak dikirim, menggunakan tanggal sekarang.',
  })
  @IsOptional()
  @IsDateString()
  receivingDate?: string;

  @ApiProperty({
    type: [CreatePurchaseReceivingItemDto],
    example: [
      {
        purchaseItemId: 'purchase-item-uuid-1',
        quantity: 50,
      },
      {
        purchaseItemId: 'purchase-item-uuid-2',
        quantity: 10,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseReceivingItemDto)
  items: CreatePurchaseReceivingItemDto[];
}
