import { Module } from '@nestjs/common';
import { EngineService } from '@modules/area/engine.service';
import { PrismaService } from '@common/database/prisma.service';
import { DiscordModule } from '@modules/discord/discord.module';
import { TimeCronAction } from '@modules/actions/time/cron';
import { DiscordSendMessageReaction } from '@modules/reactions/discord/send-message';

@Module({
    imports: [DiscordModule],
    providers: [
        PrismaService,
        EngineService,
        TimeCronAction,
        DiscordSendMessageReaction
    ],
})
export class EngineModule {}
