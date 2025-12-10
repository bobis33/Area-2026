import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TimeService } from './time.service';

@ApiTags('Time')
@Controller('time')
export class TimeController {
    constructor(private readonly timeService: TimeService) {}

    @Get()
    @ApiQuery({
        name: 'timezone',
        required: false,
        example: 'Europe/Paris',
        description: 'Timezone to fetch from WorldTimeAPI',
    })
    @ApiResponse({
        status: 200,
        description: 'Current time for the given timezone.',
        schema: {
            example: {
                abbreviation: 'CET',
                datetime: '2025-01-15T15:45:34.123456+01:00',
                timezone: 'Europe/Paris',
                day_of_week: 3,
                day_of_year: 45,
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid timezone or request error.',
    })
    async getCurrentTime(@Query('timezone') timezone?: string) {
        return this.timeService.getCurrentTime(timezone);
    }
}
