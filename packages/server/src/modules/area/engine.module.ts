import { Module } from '@nestjs/common';
import { EngineService } from '@modules/area/engine.service';
import { PrismaService } from '@common/database/prisma.service';
import { DiscordModule } from '@modules/discord/discord.module';
import { GmailModule } from '@modules/gmail/gmail.module';
import { TimeCronAction } from '@modules/area/actions/time/cron';
import { DiscordSendMessageChannelReaction } from '@modules/area/reactions/discord/send-message-channel';
import { DiscordSendMessageUserReaction } from '@modules/area/reactions/discord/send-message-user';
import { GmailSendEmailReaction } from '@modules/area/reactions/gmail/send-email';
import { GmailCreateDraftReaction } from '@modules/area/reactions/gmail/create-draft';
import { AreaService } from '@modules/area/area.service';
import { AreaController } from '@modules/area/area.controller';

@Module({
  imports: [DiscordModule, GmailModule],
  providers: [
    PrismaService,
    EngineService,
    TimeCronAction,
    AreaService,
    DiscordSendMessageChannelReaction,
    DiscordSendMessageUserReaction,
    GmailSendEmailReaction,
    GmailCreateDraftReaction,
  ],
  controllers: [AreaController],
})
export class EngineModule {}
