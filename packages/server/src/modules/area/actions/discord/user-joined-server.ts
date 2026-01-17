import { Injectable, BadRequestException } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { DiscordService } from '@modules/discord/discord.service';

interface DiscordUserJoinedState {
  lastMemberId?: string;
}

export interface DiscordUserJoinedParams {
  guildId: string;
}

@Action({
  name: 'discord.user_joined_server',
  description: 'Triggers when a new user joins the Discord server',
  oauth: true,
  parameters: {
    guildId: {
      type: 'string',
      description: 'The Discord server (guild) ID to monitor',
      optional: false,
    },
  },
})
@Injectable()
export class DiscordUserJoinedServerAction implements ActionHandler {
  constructor(private readonly discordService: DiscordService) {}

  async check(
    parameters: DiscordUserJoinedParams,
    currentState: DiscordUserJoinedState | null,
    _context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    if (!parameters.guildId) {
      throw new BadRequestException('Guild ID is required');
    }

    const members = await this.discordService.getServerMembers(
      parameters.guildId,
      1,
    );
    const state = currentState ?? {};

    if (!members.length) {
      return { triggered: false, newState: state };
    }

    const latestMember = members[0];
    const isNew =
      !state.lastMemberId || latestMember.id !== state.lastMemberId;

    if (!isNew) {
      return { triggered: false, newState: state };
    }

    return {
      triggered: true,
      newState: {
        lastMemberId: latestMember.id,
        member: {
          id: latestMember.id,
          username: latestMember.username,
          joinedAt: latestMember.joinedAt,
        },
      },
    };
  }
}
