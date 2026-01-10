import { ReactionHandler } from '@interfaces/area.interface';
import { Type } from '@nestjs/common';
import { DiscordSendMessageChannelReaction } from '@modules/area/reactions/discord/send-message-channel';
import { DiscordSendMessageUserReaction } from '@modules/area/reactions/discord/send-message-user';
import { GmailSendEmailReaction } from '@modules/area/reactions/google/gmail/send-email';
import { GmailCreateDraftReaction } from '@modules/area/reactions/google/gmail/create-draft';

export const ReactionsRegistry: Record<string, Type<ReactionHandler>> = {
  'discord.send_message_channel': DiscordSendMessageChannelReaction,
  'discord.send_message_user': DiscordSendMessageUserReaction,
  'google.send_email': GmailSendEmailReaction,
  'google.create_draft': GmailCreateDraftReaction,
};
