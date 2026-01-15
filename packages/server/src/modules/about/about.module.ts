import { Module } from '@nestjs/common';
import { AboutController } from '@modules/about/about.controller';
import { AreaService } from '@modules/area/area.service';

@Module({
  controllers: [AboutController],
  providers: [AreaService],
})
export class AboutModule {}
