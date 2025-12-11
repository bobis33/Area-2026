import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  async getCurrentTime(timezone: string = 'Europe/Paris') {
    const res = await fetch(
      `https://worldtimeapi.org/api/timezone/${timezone}`,
    );

    if (!res.ok) {
      throw new Error(`WorldTimeAPI error for timezone: ${timezone}`);
    }

    return res.json();
  }
}
