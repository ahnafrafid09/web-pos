import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token yang diberikan saat login.',
  })
  @IsString({
    message: 'Refresh token harus berupa string',
  })
  @IsNotEmpty({
    message: 'Refresh token wajib diisi',
  })
  refreshToken: string;
}
