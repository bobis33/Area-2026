import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export interface OAuthProfile {
  id: string;
  email?: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  displayName?: string;
  username?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  photos?: Array<{ value: string }>;
  provider: string;
  _raw?: string;
  _json?: any;
}

export interface OAuthUser {
  email: string;
  name?: string;
  provider?: string;
  providerId?: string;
  avatar?: string;
}

export class OAuthCallbackUserDto {
  @IsNumber()
  id!: number;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  provider?: string;
}

export class OAuthCallbackDto {
  @IsString()
  accessToken!: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ValidateNested()
  @Type(() => OAuthCallbackUserDto)
  user!: OAuthCallbackUserDto;
}
