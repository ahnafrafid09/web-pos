import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from 'src/generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({
    example: 'Ahnaf Admin',
    description: 'Nama user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'admin',
    description: 'Username user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'admin@warteg.com',
    description: 'Email user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password user',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: [UserRole.ADMIN, UserRole.CASHIER],
    example: UserRole.ADMIN,
    description: 'Role user yang dibuat oleh OWNER',
  })
  @IsEnum(UserRole)
  role: UserRole;
}
