import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AreaService } from '@modules/area/area.service';

@ApiTags('meta')
@Controller('about.json')
export class AboutController {
  constructor(private readonly areaService: AreaService) {}
  @Get()
  @ApiResponse({ status: 200, description: 'Returns server information' })
  get(@Req() req: Request) {
    return {
      client: {
        host:
          req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
          req.socket.remoteAddress ||
          'unknown',
      },
      server: {
        current_time: Math.floor(Date.now() / 1000),
        uptime: process.uptime(),
        version: '0.0.1',
        services: this.areaService.groupByService(),
      },
    };
  }
}
