import { Module } from '@nestjs/common';
import { DiscordService } from '@modules/discord/discord.service';

@Module({
    providers: [DiscordService],
    exports: [DiscordService],
})
export class DiscordModule {}
