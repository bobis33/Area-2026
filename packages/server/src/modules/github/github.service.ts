import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';

interface GitHubNotification {
  id: string;
  repository: {
    full_name: string;
  };
  subject: {
    title: string;
    type: string;
    url: string;
  };
}

@Injectable()
export class GithubService {
  constructor(private prisma: PrismaService) {}

  async getToken(userId: number): Promise<string> {
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
  async getUserNotifications(token: string): Promise<GitHubNotification[]> {
    const res = await fetch('https://api.github.com/notifications', {
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
