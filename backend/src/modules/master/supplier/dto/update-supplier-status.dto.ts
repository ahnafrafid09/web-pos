import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateSupplierStatusDto {
  @ApiProperty({
    example: true,
    description: 'true untuk mengaktifkan, false untuk menonaktifkan supplier',
  })
  @IsBoolean()
  status: boolean;
}
