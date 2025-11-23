import { Module } from '@nestjs/common';
import { AboutController } from '@about/about.controller';

@Module({
  controllers: [AboutController],
})
export class AboutModule {}
