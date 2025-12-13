import {
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsOptional,
  IsDate,
  IsNotEmpty,
  MinLength,
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
  provider_id!: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
  })
  @IsString()
  role!: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  created_at!: Date;
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

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password!: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: AuthenticatedUserDto })
  user!: AuthenticatedUserDto;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token!: string;
}
