import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('about.json')
export class AboutController {
  @Get()
  getAbout(@Req() req: Request) {
    const clientIp =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown';

    const currentTime = Math.floor(Date.now() / 1000);

    return {
      client: {
        host: clientIp,
      },
      server: {
        current_time: currentTime,
        uptime: process.uptime(),
        version: '0.0.1',
        services: [
          {
            name: '',
            actions: [
              {
                name: '',
                description: '',
              },
            ],
            reactions: [
              {
                name: '',
                description: '',
              },
            ],
          },
        ],
      },
    };
  }
}
