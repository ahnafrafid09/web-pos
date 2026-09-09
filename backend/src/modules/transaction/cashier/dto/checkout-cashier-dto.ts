import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID product',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Jumlah product yang dibeli',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  quantity: number;
}

export class CheckoutPaymentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID payment method',
  })
  @IsUUID()
  paymentMethodId: string;

  @ApiProperty({
    example: 50000,
    description: 'Jumlah pembayaran',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  amount: number;
}

export class CheckoutCashierDto {
  @ApiProperty({
    type: [CheckoutItemDto],
    example: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];

  @ApiPropertyOptional({
    example: 10,
    description: 'Nilai discount',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  discount?: number;

  @ApiProperty({
    type: [CheckoutPaymentDto],
    example: [
      {
        paymentMethodId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 50000,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutPaymentDto)
  payments: CheckoutPaymentDto[];
}
