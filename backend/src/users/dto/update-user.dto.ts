import { Transform } from 'class-transformer';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'password123',
    description: 'Password baru. Kosongkan jika tidak ingin mengubah password.',
    minLength: 8,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
