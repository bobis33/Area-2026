import {
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AuthenticatedUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  id!: number;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    description: 'User display name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://cdn.example.com/avatar.png',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'OAuth provider name',
    example: 'discord',
  })
  @IsString()
  provider!: string;

  @ApiProperty({
    description: 'Provider-specific user ID',
    example: '123456789',
  })
  @IsString()
  providerId!: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
  })
  @IsString()
  role!: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;
}

export class AuthStatusDto {
  @ApiProperty({
    description: 'Whether user is authenticated',
    example: true,
  })
  @IsBoolean()
  authenticated!: boolean;

  @ApiPropertyOptional({
    description: 'Authenticated user information',
    type: AuthenticatedUserDto,
  })
  @ValidateNested()
  @Type(() => AuthenticatedUserDto)
  @IsOptional()
  user?: AuthenticatedUserDto;
}
