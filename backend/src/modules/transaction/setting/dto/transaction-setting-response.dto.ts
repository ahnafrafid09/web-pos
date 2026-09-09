import { ApiProperty } from '@nestjs/swagger';

export class TransactionSettingResponseDto {
  @ApiProperty({
    example: 'a8f4d8f1-1234-4567-8901-abcdef123456',
  })
  id: string;

  @ApiProperty({
    example: 'tenant-id',
  })
  tenantId: string;

  @ApiProperty({
    example: true,
  })
  taxEnabled: boolean;

  @ApiProperty({
    example: 10,
  })
  taxRate: number;

  @ApiProperty({
    example: true,
  })
  serviceChargeEnabled: boolean;

  @ApiProperty({
    example: 5,
  })
  serviceChargeRate: number;

  @ApiProperty({
    example: '2026-09-05T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-09-05T00:00:00.000Z',
  })
  updatedAt: Date;
}
