import { Module } from '@nestjs/common';
import { GmailService } from '@modules/gmail/gmail.service';

@Module({
  providers: [GmailService],
  exports: [GmailService],
})
export class GmailModule {}
