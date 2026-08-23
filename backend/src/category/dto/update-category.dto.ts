import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Makanan',
    description: 'Nama Kategori Produk',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
