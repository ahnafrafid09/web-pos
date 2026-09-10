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
import { PaymentMethodUsage } from '../../../../generated/prisma/enums';

export class CreatePaymentMethodDto {
  @ApiProperty({
    example: 'Nama Metode Pembayaran',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    enum: PaymentMethodUsage,
    example: PaymentMethodUsage.TRANSACTION,
  })
  @IsEnum(PaymentMethodUsage)
  usageType: PaymentMethodUsage;

  @ApiPropertyOptional({
    example: 'BCA',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  code: string;
}
