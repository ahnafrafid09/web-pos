import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTransactionSettingDto {
  @ApiPropertyOptional({
    description: 'Mengaktifkan atau menonaktifkan tax',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  taxEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Persentase tax',
    example: 10,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @ApiPropertyOptional({
    description: 'Mengaktifkan atau menonaktifkan service charge',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  serviceChargeEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Persentase service charge',
    example: 5,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  serviceChargeRate?: number;
}
