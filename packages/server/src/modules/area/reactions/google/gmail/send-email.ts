import { Injectable } from '@nestjs/common';
import { GmailService } from '@modules/google/gmail/gmail.service';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';

@Reaction({
  parameters: {
    to: {
      type: 'string',
      description: 'The email address of the recipient',
      example: 'recipient@example.com',
    },
    subject: {
      type: 'string',
      description: 'The subject of the email',
      example: 'Important notification',
    },
    body: {
      type: 'string',
      description: 'The body content of the email',
      example: 'Hello, this is an automated email from AREA.',
    },
    isHtml: {
      type: 'boolean',
      description: 'Whether the email body is HTML formatted',
      example: false,
    },
  },
  name: 'gmail.send_email',
  description: 'Sends an email via Gmail',
})
@Injectable()
export class GmailSendEmailReaction implements ReactionHandler {
  constructor(private gmail: GmailService) {}

  async execute(
    params: {
      to: string;
      subject: string;
      body: string;
      isHtml?: boolean;
    },
    context?: { userId: number },
  ): Promise<void> {
    if (!context?.userId) {
      throw new Error('User context required for Gmail operations');
    }

    const { to, subject, body, isHtml } = params;

    await this.gmail.sendEmail(context.userId, { to, subject, body, isHtml });
    console.log(`Email sent to ${to} with subject: '${subject}'`);
  }
}
