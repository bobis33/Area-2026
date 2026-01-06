import { Module } from '@nestjs/common';
import { GithubService } from '@modules/github/github.service';

@Module({
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
