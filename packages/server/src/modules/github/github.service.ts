import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { GithubNotification } from '@interfaces/github-notification.interface';

@Injectable()
export class GithubService {
  private readonly baseUrl = 'https://api.github.com';
  constructor(private prisma: PrismaService) {}

  private async getToken(userId: number): Promise<string> {
    const account = await this.prisma.providerAccount.findFirst({
      where: {
        user_id: userId,
        provider: 'github',
      },
    });

    if (!account) {
      throw new Error(
        'Github account not linked. Please login with Github first.',
      );
    }
    return account.access_token;
  }

  async getUserNotifications(userId: number): Promise<GithubNotification[]> {
    const token = await this.getToken(userId);
    const res = await fetch(`${this.baseUrl}/notifications`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}`);
    }

    return res.json();
  }
}
