import { Injectable } from "@nestjs/common";
import { ActionHandler } from "@interfaces/actions";

@Injectable()
export class TimeCronAction implements ActionHandler {

    async check(params: { every: "seconds" | "minutes" | "hours", interval?: number }, state: any) {
        const interval = params.interval ?? 1;

        const now = Date.now();

        const lastExecution = state?.lastExecution ?? 0;

        const diffMs = now - lastExecution;

        const multipliers = {
            seconds: 1000,
            minutes: 60 * 1000,
            hours:   3600 * 1000,
        };

        const expectedMs = multipliers[params.every] * interval;

        const triggered = diffMs >= expectedMs;

        return {
            name: "TimeEvery",
            description: "Triggers on a fixed interval",
            triggered,
            newState: {
                lastExecution: triggered ? now : lastExecution
            }
        };
    }
}
