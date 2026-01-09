import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
  public client: Client;

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
}
