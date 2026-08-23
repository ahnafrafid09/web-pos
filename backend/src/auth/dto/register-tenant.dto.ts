import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterTenantDto {
  @ApiProperty({
    example: 'Warteg Pak Budi',
    description: 'Nama bisnis/tenant',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  tenantName: string;

  @ApiProperty({
    example: 'warteg-pak-budi',
    description: 'Slug unik tenant, hanya huruf kecil, angka, dan tanda -',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'tenantSlug hanya boleh berisi huruf kecil, angka, dan tanda -',
  })
  tenantSlug: string;

  @ApiProperty({
    example: 'Budi',
  })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({
    example: 'budi',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'budi@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
