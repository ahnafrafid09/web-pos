import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdatePaymentMethodStatusDto {
  @ApiProperty({
    example: true,
    description: 'true untuk mengaktifkan, false untuk menonaktifkan category',
  })
  @IsBoolean()
  status: boolean;
}
