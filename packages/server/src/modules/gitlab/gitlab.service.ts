import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { GitlabTodo } from '@interfaces/gitlab.interface';

@Injectable()
export class GitlabService implements OnModuleInit {
  private readonly baseUrl = 'https://gitlab.com/api/v4';

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {}

  private async getToken(userId: number): Promise<string> {
    const account = await this.prisma.providerAccount.findFirst({
      where: {
        user_id: userId,
        provider: 'gitlab',
      },
    });

    if (!account) {
      throw new Error(
        'GitLab account not linked. Please login with GitLab first.',
      );
    }

    return account.access_token;
  }

  async getUserTodos(userId: number): Promise<GitlabTodo[]> {
    const token = await this.getToken(userId);

    const res = await fetch(`${this.baseUrl}/todos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GitLab API error ${res.status}: ${body}`);
    }

    return res.json();
  }
}
