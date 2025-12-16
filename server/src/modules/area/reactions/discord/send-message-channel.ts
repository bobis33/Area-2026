import { Injectable } from '@nestjs/common';
import { DiscordService } from '@modules/discord/discord.service';
import { TextChannel } from 'discord.js';
import { ReactionHandler } from '@interfaces/area';
import { Reaction } from '@decorators/area.decorator';

@Reaction({
  parameters: {
    channelId: {
      type: 'string',
      description: 'The ID of the Discord channel to send the message to',
      example: '123456789012345678',
    },
    message: {
      type: 'string',
      description: 'The message to send to the Discord channel',
      example: 'Hello, world!',
    },
  },
  name: 'discord.send_message_channel',
  description: 'Sends a message to a Discord channel',
})
@Injectable()
export class DiscordSendMessageChannelReaction implements ReactionHandler {
  constructor(private discord: DiscordService) {}

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
