import { Injectable, Logger } from '@nestjs/common';
import { google, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '@common/database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GmailService {
  private readonly logger = new Logger(GmailService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private async getGmailClient(userId: number): Promise<gmail_v1.Gmail> {
    const account = await this.prisma.providerAccount.findFirst({
      where: {
        user_id: userId,
        provider: 'google',
      },
    });

    if (!account) {
      throw new Error(
        'Google account not linked. Please login with Google first.',
      );
    }

    const oauth2Client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL'),
    );

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token || undefined,
    });

    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        await this.prisma.providerAccount.update({
          where: { id: account.id },
          data: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || account.refresh_token,
          },
        });
        this.logger.log(`Access token refreshed for user ${userId}`);
      }
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  async sendEmail(
    userId: number,
    params: {
      to: string;
      subject: string;
      body: string;
      isHtml?: boolean;
    },
  ): Promise<void> {
    const { to, subject, body, isHtml = false } = params;

    const gmail = await this.getGmailClient(userId);

    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/${isHtml ? 'html' : 'plain'}; charset=utf-8`,
      '',
      body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    this.logger.log(`Email sent to ${to} with subject: ${subject}`);
  }

  async createDraft(
    userId: number,
    params: {
      to: string;
      subject: string;
      body: string;
      isHtml?: boolean;
    },
  ): Promise<void> {
    const { to, subject, body, isHtml = false } = params;

    const gmail = await this.getGmailClient(userId);

    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/${isHtml ? 'html' : 'plain'}; charset=utf-8`,
      '',
      body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage,
        },
      },
    });

    this.logger.log(`Draft created for ${to} with subject: ${subject}`);
  }

  async addLabel(
    userId: number,
    params: {
      messageId: string;
      labelIds: string[];
    },
  ): Promise<void> {
    const { messageId, labelIds } = params;

    const gmail = await this.getGmailClient(userId);

    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds: labelIds,
      },
    });

    this.logger.log(
      `Labels ${labelIds.join(', ')} added to message ${messageId}`,
    );
  }

  async getLabels(userId: number): Promise<gmail_v1.Schema$Label[]> {
    const gmail = await this.getGmailClient(userId);

    const response = await gmail.users.labels.list({
      userId: 'me',
    });

    return response.data.labels || [];
  }
}
