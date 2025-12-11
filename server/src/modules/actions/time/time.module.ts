import { Module } from '@nestjs/common';
import { TimeController } from '@modules/actions/time/time.controller';
import { TimeService } from '@modules/actions/time/time.service';

@Module({
  controllers: [TimeController],
  providers: [TimeService],
  exports: [TimeService],
})
export class TimeModule {}
