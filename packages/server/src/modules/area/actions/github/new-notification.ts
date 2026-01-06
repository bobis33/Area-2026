import { Injectable } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { GithubService } from '@modules/github/github.service';

@Action({
  name: 'github.new_notifications',
  description:
    'Triggers when there are new notifications in your GitHub account',
  parameters: {
    pollInterval: {
      type: 'number',
      description: 'Interval in seconds to poll for new notifications',
      example: 60,
      optional: true,
    },
  },
})
@Injectable()
export class GitHubNewNotificationsAction implements ActionHandler {
  constructor(private readonly githubService: GithubService) {}

  async check(
    _parameters: { pollInterval?: number },
    currentState: { lastNotificationId?: string } = {},
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    const token = await this.githubService.getToken(context!.userId);

    const notifications = await this.githubService.getUserNotifications(token);

    if (!notifications.length) {
      return { triggered: false, newState: currentState };
    }

    const last = notifications[0];
    const lastNotificationId = currentState?.lastNotificationId;

    if (last.id !== lastNotificationId) {
      return {
        triggered: true,
        newState: {
          lastNotificationId: last.id,
          total: notifications.length,
          notifications: notifications.map((n) => ({
            id: n.id,
            repo: n.repository.full_name,
            title: n.subject.title,
            type: n.subject.type,
            url: n.subject.url,
          })),
        },
      };
    }

    return { triggered: false, newState: currentState };
  }
}
