import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthMeUserDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: 'Ahnaf Rafid',
  })
  name: string;

  @ApiProperty({
    example: 'ahnaf',
  })
  username: string;

  @ApiProperty({
    example: 'ahnaf@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'OWNER',
    enum: ['SUPER_ADMIN', 'OWNER', 'ADMIN', 'CASHIER'],
  })
  role: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  tenantId: string | null;
}

export class AuthMeTenantDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: 'Warteg Pak Budi',
  })
  name: string;

  @ApiProperty({
    example: 'warteg-pak-budi',
  })
  slug: string;
}

export class AuthMeResponseDto {
  @ApiProperty({
    type: AuthMeUserDto,
  })
  user: AuthMeUserDto;

  @ApiPropertyOptional({
    type: AuthMeTenantDto,
    nullable: true,
  })
  tenant: AuthMeTenantDto | null;
}
