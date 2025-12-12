import { Injectable } from '@nestjs/common';
import { DiscordService } from '@modules/discord/discord.service';
import {TextChannel} from "discord.js";

@Injectable()
export class DiscordSendMessageReaction {
    constructor(private discord: DiscordService) {}

    name = 'discord.send_message';
    description = 'Sends a message to a Discord channel';
    async execute(params: any) {
        const { channelId, message } = params;

        const channel = await this.discord.client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased() || !(channel instanceof TextChannel)) {
            throw new Error(`Invalid channel ${channelId}`);
        }

        await channel.send(message);
    }
}
