import { Injectable, Logger } from '@nestjs/common';
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
      description: 'The subject of the draft email',
      example: 'Draft notification',
    },
    body: {
      type: 'string',
      description: 'The body content of the draft email',
      example: 'This is a draft email from AREA.',
    },
    isHtml: {
      type: 'boolean',
      description: 'Whether the email body is HTML formatted',
      example: false,
    },
  },
  name: 'google.gmail_create_draft',
  description: 'Creates a draft email in Gmail',
})
@Injectable()
export class GmailCreateDraftReaction implements ReactionHandler {
  private readonly logger = new Logger(GmailCreateDraftReaction.name);
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

    await this.gmail.createDraft(context.userId, { to, subject, body, isHtml });
    this.logger.log(`Draft created for ${to} with subject: '${subject}'`);
  }
}
