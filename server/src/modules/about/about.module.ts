import { Module } from '@nestjs/common';
import { AboutController } from '@modules/about/about.controller';

@Module({
  controllers: [AboutController],
})
export class AboutModule {}
