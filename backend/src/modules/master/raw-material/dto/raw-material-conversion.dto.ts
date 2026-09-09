import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RawMaterialConversionDto {
  @ApiProperty({
    example: 'uuid-renceng',
    description: 'Unit pembelian/kemasan',
  })
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @ApiProperty({
    example: 10,
    description: 'Jumlah unit dasar dalam satu unit pembelian',
  })
  @IsNumber()
  @Min(0.000001)
  factor: number;
}
