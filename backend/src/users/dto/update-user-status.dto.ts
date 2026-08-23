import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({
    example: true,
    description: 'true untuk mengaktifkan, false untuk menonaktifkan user',
  })
  @IsBoolean()
  status: boolean;
}
