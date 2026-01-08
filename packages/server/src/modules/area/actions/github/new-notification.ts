import { Injectable } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { GithubService } from '@modules/github/github.service';

@Action({
  name: 'github.new_notifications',
  description:
    'Triggers when there are new notifications in your GitHub account',
  parameters: {},
})
@Injectable()
export class GithubNewNotificationAction implements ActionHandler {
  constructor(private readonly githubService: GithubService) {}

  async check(
    _parameters: object,
    currentState: { lastSeenAt?: string } | null,
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    const notifications = await this.githubService.getUserNotifications(
      context!.userId,
    );
    const state = currentState ?? {};

    if (!notifications.length) {
      return { triggered: false, newState: state };
    }

    if (!state.lastSeenAt) {
      return {
        triggered: false,
        newState: {
          lastSeenAt: notifications[0].updated_at ?? new Date().toISOString(),
        },
      };
    }

    const lastSeen = new Date(state.lastSeenAt);

    const newOnes = notifications.filter((n) => {
      if (!n.updated_at) return false;
      return new Date(n.updated_at) > lastSeen;
    });

    if (!newOnes.length) {
      return { triggered: false, newState: state };
    }

    const newest = newOnes
      .map((n) => new Date(n.updated_at))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return {
      triggered: true,
      newState: {
        lastSeenAt: newest.toISOString(),
        total: notifications.length,
        notifications: newOnes.map((n) => ({
          id: n.id,
          repo: n.repository.full_name,
          title: n.subject.title,
          type: n.subject.type,
          url: n.subject.url,
        })),
      },
    };
  }
}
