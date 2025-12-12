import { TimeCronAction } from '@modules/actions/time/cron';
import {ActionHandler} from "@interfaces/actions";

export const ActionsRegistry: Record<string, new (...args: any[]) => ActionHandler> = {
    'time.cron': TimeCronAction,
};
