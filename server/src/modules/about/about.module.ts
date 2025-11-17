import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';

@Module({
  controllers: [AboutController],
})
export class AboutModule {}
