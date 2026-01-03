import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiResponse({ status: 200, description: 'Health check status' })
  get() {
    return { status: 'ok' };
  }
}
