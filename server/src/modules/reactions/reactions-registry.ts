import {ReactionHandler} from "@interfaces/reaction";
import {DiscordSendMessageReaction} from "@modules/reactions/discord/send-message";
import {Type} from "@nestjs/common";

export const ReactionsRegistry: Record<string, Type<ReactionHandler>> = {
    'discord.send_message': DiscordSendMessageReaction,
};
