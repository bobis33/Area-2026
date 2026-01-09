import { Injectable } from '@nestjs/common';
import { DiscordService } from '@modules/discord/discord.service';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';

@Reaction({
  parameters: {
    userId: {
      type: 'string',
      description: 'The ID of the Discord user to send the message to',
      example: '123456789012345678',
    },
    message: {
      type: 'string',
      description: 'The message to send to the Discord user',
      example: 'Hello, world!',
    },
  },
  name: 'discord.send_message_user',
  description: 'Sends a message to a Discord user',
})
@Injectable()
export class DiscordSendMessageUserReaction implements ReactionHandler {
  constructor(private discord: DiscordService) {}

  async execute(params: { userId: string; message: string }): Promise<void> {
    await this.discord.sendMessageToUser(params.userId, params.message);
  }
}
