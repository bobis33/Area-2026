import { TimeCronAction } from '@modules/area/actions/time/cron';
import { GithubNewNotificationAction } from '@modules/area/actions/github/new-notification';
import { ActionHandler } from '@interfaces/area.interface';

export const ActionsRegistry: Record<
  string,
  new (...args: any[]) => ActionHandler
> = {
  'time.cron': TimeCronAction,
  'github.new_notification': GithubNewNotificationAction,
};
