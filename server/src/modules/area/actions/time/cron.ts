import { Injectable } from '@nestjs/common';
import { CronExpressionParser } from 'cron-parser';
import { ActionHandler } from '@interfaces/actions';
import { Action } from '@decorators/area.decorator';

@Action({
  parameters: {
    cron: {
      type: 'string',
      description: 'The cron expression to evaluate',
      example: '*/5 * * * *',
    },
    timezone: {
      type: 'string',
      description: 'The timezone to use (default: Europe/Paris)',
      example: 'Europe/Paris',
      optional: true,
    },
  },
  name: 'time.cron',
  description: 'Triggers based on a cron expression',
})
@Injectable()
export class TimeCronAction implements ActionHandler {
  async check(params: { cron: string; timezone?: string }, state: any) {
    if (!params.cron) throw new Error('Missing cron');

    const now = new Date();
    const timezone = params.timezone ?? 'Europe/Paris';
    const last = state?.lastExecution ? new Date(state.lastExecution) : null;
    const interval = CronExpressionParser.parse(params.cron, {
      currentDate: last ?? now,
      tz: timezone,
    });

    if (!last) {
      const next = interval.next();

      return {
        triggered: false,
        newState: { lastExecution: next.toISOString() },
      };
    }

    const next = interval.next();
    const triggered = next.getTime() <= now.getTime();

    return {
      triggered,
      newState: {
        lastExecution: triggered ? now.toISOString() : state.lastExecution,
      },
    };
  }
}
