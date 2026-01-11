import { Injectable } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { GitlabService } from '@modules/gitlab/gitlab.service';

@Action({
  name: 'gitlab.new_notifications',
  description: 'Triggers when there are new todos in your GitLab account',
  parameters: {},
})
@Injectable()
export class GitlabNewTodoAction implements ActionHandler {
  constructor(private readonly gitlabService: GitlabService) {}

  async check(
    _parameters: object,
    currentState: { lastSeenAt?: string } | null,
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    const todos = await this.gitlabService.getUserTodos(context!.userId);
    const state = currentState ?? {};

    if (!todos.length) {
      return { triggered: false, newState: state };
    }

    if (!state.lastSeenAt) {
      return {
        triggered: false,
        newState: {
          lastSeenAt: todos[0].created_at ?? new Date().toISOString(),
        },
      };
    }

    const lastSeen = new Date(state.lastSeenAt);

    const newOnes = todos.filter((t) => {
      if (!t.created_at) return false;
      return new Date(t.created_at) > lastSeen;
    });

    if (!newOnes.length) {
      return { triggered: false, newState: state };
    }

    const newest = newOnes
      .map((t) => new Date(t.created_at))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return {
      triggered: true,
      newState: {
        lastSeenAt: newest.toISOString(),
        total: todos.length,
        todos: newOnes.map((t) => ({
          id: t.id,
          action: t.action_name,
          body: t.body,
          type: t.target_type,
          url: t.target_url,
          project: t.project?.name,
          author: t.author.username,
        })),
      },
    };
  }
}
