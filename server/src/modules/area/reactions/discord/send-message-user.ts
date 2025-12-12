import { Injectable } from '@nestjs/common';
import { DiscordService } from '@modules/discord/discord.service';
import { TextChannel } from 'discord.js';
import { ReactionHandler } from '@interfaces/reaction';

@Injectable()
export class DiscordSendMessageUserReaction implements ReactionHandler {
  constructor(private discord: DiscordService) {}

  name = 'discord.send_message_user';
  description = 'Sends a message to a Discord user';
  async execute(params: { userId: string; message: string }): Promise<void> {
    const { userId, message } = params;

    const user = await this.discord.client.users.fetch(userId);
    if (!user) {
      throw new Error(`Invalid user ${userId}`);
    }

    await user.send(message);
  }
}
