import { Injectable, BadRequestException } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { DiscordService } from '@modules/discord/discord.service';

interface DiscordMessageState {
  lastMessageId?: string;
}

export interface DiscordMessagePostedParams {
  channelId: string;
}

@Action({
  name: 'discord.message_posted',
  description: 'Triggers when a new message is posted in a Discord channel',
  oauth: true,
  parameters: {
    channelId: {
      type: 'string',
      description: 'The Discord channel ID to monitor',
      optional: false,
    },
  },
})
@Injectable()
export class DiscordMessagePostedAction implements ActionHandler {
  constructor(private readonly discordService: DiscordService) {}

  async check(
    parameters: DiscordMessagePostedParams,
    currentState: DiscordMessageState | null,
    _context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    if (!parameters.channelId) {
      throw new BadRequestException('Channel ID is required');
    }

    const messages = await this.discordService.getChannelMessages(
      parameters.channelId,
      1,
    );
    const state = currentState ?? {};

    if (!messages.length) {
      return { triggered: false, newState: state };
    }

    const latestMessage = messages[0];
    const isNew =
      !state.lastMessageId || latestMessage.id !== state.lastMessageId;

    if (!isNew) {
      return { triggered: false, newState: state };
    }

    return {
      triggered: true,
      newState: {
        lastMessageId: latestMessage.id,
        message: {
          id: latestMessage.id,
          author: latestMessage.author,
          content: latestMessage.content,
          timestamp: latestMessage.timestamp,
        },
      },
    };
  }
}
