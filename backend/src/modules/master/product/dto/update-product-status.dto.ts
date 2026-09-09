import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateProductStatusDto {
  @ApiProperty({
    example: true,
    description: 'true untuk mengaktifkan, false untuk menonaktifkan product',
  })
  @IsBoolean()
  status: boolean;
}
