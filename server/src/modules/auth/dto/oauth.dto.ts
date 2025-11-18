import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OAuthProvider } from '../interfaces/oauth.types';

export class OAuthEmailDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  value!: string;

  @ApiPropertyOptional({
    description: 'Whether the email is verified',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}

export class OAuthPhotoDto {
  @ApiProperty({
    description: 'Photo URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  value!: string;
}

export class OAuthNameDto {
  @ApiPropertyOptional({
    description: 'Given name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  givenName?: string;

  @ApiPropertyOptional({
    description: 'Family name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  familyName?: string;
}

export class OAuthProfileDto {
  @ApiProperty({
    description: 'OAuth provider user ID',
    example: '123456789',
  })
  @IsString()
  id!: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Array of email addresses',
    type: [OAuthEmailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OAuthEmailDto)
  @IsOptional()
  emails?: OAuthEmailDto[];

  @ApiPropertyOptional({
    description: 'Display name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Username',
    example: 'johndoe',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    description: 'Name object (Google)',
    type: OAuthNameDto,
  })
  @ValidateNested()
  @Type(() => OAuthNameDto)
  @IsOptional()
  name?: OAuthNameDto;

  @ApiPropertyOptional({
    description: 'Array of photos',
    type: [OAuthPhotoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OAuthPhotoDto)
  @IsOptional()
  photos?: OAuthPhotoDto[];

  @ApiProperty({
    description: 'OAuth provider name',
    enum: OAuthProvider,
    example: OAuthProvider.DISCORD,
  })
  @IsEnum(OAuthProvider)
  provider!: OAuthProvider;

  @ApiPropertyOptional({
    description: 'Raw profile data from provider',
  })
  @IsOptional()
  _raw?: string;

  @ApiPropertyOptional({
    description: 'JSON profile data from provider',
  })
  @IsOptional()
  _json?: any;
}

export class NormalizedOAuthProfileDto {
  @ApiProperty({
    description: 'OAuth provider user ID',
    example: '123456789',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    description: 'Username',
    example: 'johndoe',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Display name',
    example: 'John Doe',
  })
  @IsString()
  displayName!: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://cdn.example.com/avatar.png',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'OAuth provider',
    enum: OAuthProvider,
    example: OAuthProvider.DISCORD,
  })
  @IsEnum(OAuthProvider)
  provider!: OAuthProvider;

  @ApiProperty({
    description: 'Provider-specific user ID',
    example: '123456789',
  })
  @IsString()
  providerId!: string;

  @ApiPropertyOptional({
    description: 'Raw profile data',
  })
  @IsOptional()
  raw?: any;
}

export class OAuthTokensDto {
  @ApiProperty({
    description: 'OAuth access token',
    example: 'ya29.a0AfH6SMBx...',
  })
  @IsString()
  accessToken!: string;

  @ApiProperty({
    description: 'OAuth refresh token',
    example: '1//0gHZKp7C...',
  })
  @IsString()
  refreshToken!: string;

  @ApiPropertyOptional({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  @IsNumber()
  @IsOptional()
  expiresIn?: number;
}

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

export class OAuthCallbackResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  accessToken!: string;

  @ApiPropertyOptional({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiProperty({
    description: 'Authenticated user information',
    type: AuthenticatedUserDto,
  })
  @ValidateNested()
  @Type(() => AuthenticatedUserDto)
  user!: AuthenticatedUserDto;
}

export class CreateUserFromOAuthDto {
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
    description: 'OAuth provider',
    enum: OAuthProvider,
    example: OAuthProvider.DISCORD,
  })
  @IsEnum(OAuthProvider)
  provider!: OAuthProvider;

  @ApiProperty({
    description: 'Provider-specific user ID',
    example: '123456789',
  })
  @IsString()
  providerId!: string;

  @ApiPropertyOptional({
    description: 'User role',
    example: 'user',
    default: 'user',
  })
  @IsString()
  @IsOptional()
  role?: string;
}

export class UpdateOAuthTokensDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  userId!: number;

  @ApiProperty({
    description: 'OAuth access token',
    example: 'ya29.a0AfH6SMBx...',
  })
  @IsString()
  accessToken!: string;

  @ApiProperty({
    description: 'OAuth refresh token',
    example: '1//0gHZKp7C...',
  })
  @IsString()
  refreshToken!: string;

  @ApiPropertyOptional({
    description: 'Token expiration time',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiresAt?: Date;
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
