import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  isEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'PT Jaya Abadi',
    description: 'Nama Supplier',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'SUPP-001',
    description: 'Code Supplier',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Jalan Sabar',
    description: 'Alamat Supplier',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: 'ptjayaabadi@gmail.com',
    description: 'Email Supplier',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '08373416132',
    description: 'Nomor telepon supplier',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
