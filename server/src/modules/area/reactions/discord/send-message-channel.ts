import { Injectable } from '@nestjs/common';
import { DiscordService } from '@modules/discord/discord.service';
import { TextChannel } from 'discord.js';
import { ReactionHandler } from '@interfaces/reaction';

@Injectable()
export class DiscordSendMessageChannelReaction implements ReactionHandler {
  constructor(private discord: DiscordService) {}

  name = 'discord.send_message_channel';
  description = 'Sends a message to a Discord channel';
  async execute(params: { channelId: string; message: string }): Promise<void> {
    const { channelId, message } = params;

    const channel = await this.discord.client.channels.fetch(channelId);
    if (
      !channel ||
      !channel.isTextBased() ||
      !(channel instanceof TextChannel)
    ) {
      throw new Error(`Invalid channel ${channelId}`);
    }

    await channel.send(message);
    console.log(`Message: '${message}' sent to channel ${channelId}`);
  }
}
