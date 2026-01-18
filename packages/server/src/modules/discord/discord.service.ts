import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
  }

  async onModuleInit() {
    const token = this.configService.get<string>('DISCORD_BOT_TOKEN');
    await this.client.login(token);
  }

  async sendMessageToChannel(
    channelId: string,
    message: string,
  ): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);
    if (
      !channel ||
      !channel.isTextBased() ||
      !(channel instanceof TextChannel)
    ) {
      throw new Error(`Invalid channel ${channelId}`);
    }

    await channel.send(message);
  }

  async sendMessageToUser(userId: string, message: string): Promise<void> {
    const user = await this.client.users.fetch(userId);
    if (!user) {
      throw new Error(`Invalid user ${userId}`);
    }

    await user.send(message);
  }

  async getChannelMessages(
    channelId: string,
    limit: number = 5,
  ): Promise<
    Array<{
      id: string;
      author: string;
      content: string;
      timestamp: string;
    }>
  > {
    const channel = await this.client.channels.fetch(channelId);
    if (
      !channel ||
      !channel.isTextBased() ||
      !(channel instanceof TextChannel)
    ) {
      throw new Error(`Invalid channel ${channelId}`);
    }

    const messages = await channel.messages.fetch({ limit });
    return messages.reverse().map((msg) => ({
      id: msg.id,
      author: msg.author.username,
      content: msg.content,
      timestamp: msg.createdTimestamp.toString(),
    }));
  }

  async getServerMembers(
    guildId: string,
    limit: number = 10,
  ): Promise<
    Array<{
      id: string;
      username: string;
      joinedAt: string;
    }>
  > {
    const guild = await this.client.guilds.fetch(guildId);
    if (!guild) {
      throw new Error(`Invalid guild ${guildId}`);
    }

    const members = await guild.members.fetch({ limit });
    return members
      .sort(
        (a, b) => (b.joinedAt?.getTime() || 0) - (a.joinedAt?.getTime() || 0),
      )
      .map((member) => ({
        id: member.id,
        username: member.user.username,
        joinedAt: member.joinedAt?.toISOString() || new Date().toISOString(),
      }));
  }
}
