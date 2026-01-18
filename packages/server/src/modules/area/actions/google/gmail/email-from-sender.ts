import { Injectable, BadRequestException } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { GmailService } from '@modules/google/gmail/gmail.service';

interface EmailFromSenderState {
  lastEmailId?: string;
}

export interface EmailFromSenderParams {
  senderEmail: string;
}

@Action({
  name: 'google.email_from_sender',
  description: 'Triggers when a new email is received from a specific sender',
  oauth: true,
  parameters: {
    senderEmail: {
      type: 'string',
      description: 'The email address to monitor',
      optional: false,
    },
  },
})
@Injectable()
export class GoogleEmailFromSenderAction implements ActionHandler {
  constructor(private readonly gmailService: GmailService) {}

  async check(
    parameters: EmailFromSenderParams,
    currentState: EmailFromSenderState | null,
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!parameters.senderEmail) {
      throw new BadRequestException('Sender email is required');
    }

    const emails = await this.gmailService.getEmailsFromSender(
      context.userId,
      parameters.senderEmail,
      1,
    );
    const state = currentState ?? {};

    if (!emails.length) {
      return { triggered: false, newState: state };
    }

    const latestEmail = emails[0];
    const isNew = !state.lastEmailId || latestEmail.id !== state.lastEmailId;

    if (!isNew) {
      return { triggered: false, newState: state };
    }

    return {
      triggered: true,
      newState: {
        lastEmailId: latestEmail.id,
        email: {
          id: latestEmail.id,
          from: latestEmail.from,
          subject: latestEmail.subject,
          snippet: latestEmail.snippet,
          timestamp: latestEmail.internalDate,
        },
      },
    };
  }
}
