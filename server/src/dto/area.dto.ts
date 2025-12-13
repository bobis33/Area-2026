import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ActionDto {
  @ApiProperty({ example: 'time' })
  @IsString()
  service!: string;
  @ApiProperty({ example: 'cron' })
  @IsString()
  type!: string;
  @ApiProperty({
    type: Object,
    example: { cron: '*/10 * * * * *' },
  })
  @IsObject()
  parameters!: Record<string, any>;
}

export class ReactionDto {
  @ApiProperty({ example: 'discord' })
  @IsString()
  service!: string;
  @ApiProperty({ example: 'send_message_channel' })
  @IsString()
  type!: string;
  @ApiProperty({
    type: Object,
    example: { channelId: '123', message: 'Hello world' },
  })
  @IsObject()
  parameters!: Record<string, any>;
}

export class CreateAreaDto {
  @ApiProperty({ required: true })
  @IsString()
  name!: string;
  @ApiProperty({ required: true })
  @IsNumber()
  userId!: number;
  @ApiProperty({ type: ActionDto })
  @ValidateNested()
  @Type(() => ActionDto)
  action!: ActionDto;

  @ApiProperty({ type: ReactionDto })
  @ValidateNested()
  @Type(() => ReactionDto)
  reaction!: ReactionDto;
}

export class AreaResponseDto {
  @ApiProperty({ required: true })
  id!: number;
  @ApiProperty({ required: true })
  name!: string;
  @ApiProperty({ required: true })
  is_active!: boolean;
  @ApiProperty()
  user_id!: number;
  @ApiProperty()
  action!: ActionDto;
  @ApiProperty()
  reaction!: ReactionDto;
  @ApiProperty()
  created_at!: Date;
  @ApiProperty()
  updated_at!: Date;
}
