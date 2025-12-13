import { Module } from '@nestjs/common';
import { EngineService } from '@modules/area/engine.service';
import { PrismaService } from '@common/database/prisma.service';
import { DiscordModule } from '@modules/discord/discord.module';
import { TimeCronAction } from '@modules/area/actions/time/cron';
import { DiscordSendMessageChannelReaction } from '@modules/area/reactions/discord/send-message-channel';
import { DiscordSendMessageUserReaction } from '@modules/area/reactions/discord/send-message-user';
import { AreaService } from '@modules/area/area.service';
import { AreaController } from '@modules/area/area.controller';

@Module({
  imports: [DiscordModule],
  providers: [
    PrismaService,
    EngineService,
    TimeCronAction,
    AreaService,
    DiscordSendMessageChannelReaction,
    DiscordSendMessageUserReaction,
  ],
  controllers: [AreaController],
})
export class EngineModule {}
