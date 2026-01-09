import { Module } from '@nestjs/common';
import { GitlabService } from '@modules/gitlab/gitlab.service';

@Module({
  providers: [GitlabService],
  exports: [GitlabService],
})
export class GitlabModule {}
