import { Module } from '@nestjs/common';
import { EngineService } from '@modules/area/engine.service';
import { PrismaService } from '@common/database/prisma.service';
import { DiscordModule } from '@modules/discord/discord.module';
import { TimeCronAction } from '@modules/area/actions/time/cron';
import { DiscordSendMessageChannelReaction } from '@modules/area/reactions/discord/send-message-channel';
import { DiscordSendMessageUserReaction } from '@modules/area/reactions/discord/send-message-user';

@Module({
  imports: [DiscordModule],
  providers: [
    PrismaService,
    EngineService,
    TimeCronAction,
    DiscordSendMessageChannelReaction,
    DiscordSendMessageUserReaction,
  ],
})
export class EngineModule {}
