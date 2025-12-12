import { Module } from '@nestjs/common';
import { EngineService } from '@modules/area/engine.service';
import { PrismaService } from '@common/database/prisma.service';
import { DiscordModule } from '@modules/discord/discord.module';
import { TimeEveryHandler } from '@modules/actions/time.handler';
import { DiscordSendMessageReaction } from '@modules/reactions/send-message.reaction';

@Module({
    imports: [DiscordModule],
    providers: [
        PrismaService,
        EngineService,
        TimeEveryHandler,
        DiscordSendMessageReaction
    ],
})
export class EngineModule {}
