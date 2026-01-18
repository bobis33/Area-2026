import { Injectable, BadRequestException } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { GmailService } from '@modules/google/gmail/gmail.service';

interface EmailCheckState {
  lastEmailId?: string;
}

@Action({
  name: 'google.new_email',
  description: 'Triggers when a new email is received in your Gmail inbox',
  oauth: true,
  parameters: {},
})
@Injectable()
export class GoogleNewEmailAction implements ActionHandler {
  constructor(private readonly gmailService: GmailService) {}

  async check(
    _parameters: object,
    currentState: EmailCheckState | null,
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    const emails = await this.gmailService.getInboxEmails(context.userId, 1);
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
