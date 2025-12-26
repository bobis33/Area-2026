import { TimeCronAction } from '@modules/area/actions/time/cron';
import { ActionHandler } from '@interfaces/area.interface';

export const ActionsRegistry: Record<
  string,
  new (...args: any[]) => ActionHandler
> = {
  'time.cron': TimeCronAction,
};
