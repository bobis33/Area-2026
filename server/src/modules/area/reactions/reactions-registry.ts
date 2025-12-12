import { ReactionHandler } from '@interfaces/reaction';
import { Type } from '@nestjs/common';
import { DiscordSendMessageChannelReaction } from '@modules/area/reactions/discord/send-message-channel';
import { DiscordSendMessageUserReaction } from '@modules/area/reactions/discord/send-message-user';

export const ReactionsRegistry: Record<string, Type<ReactionHandler>> = {
  'discord.send_message_channel': DiscordSendMessageChannelReaction,
  'discord.send_message_user': DiscordSendMessageUserReaction,
};
