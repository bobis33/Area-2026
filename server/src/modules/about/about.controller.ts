import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('About')
@Controller('about.json')
export class AboutController {
  @Get()
  @ApiResponse({ status: 200, description: 'Returns server information' })
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
