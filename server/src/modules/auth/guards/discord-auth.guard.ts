import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const redirect = (req.query?.redirect as string | undefined) || undefined;

    const options: Record<string, any> = {
      // Preserve default Discord OAuth scopes
      scope: ['identify', 'email'],
    };

    if (redirect) {
      // Use OAuth "state" parameter to transport the mobile redirect URL
      // The provider will return this state value in the callback
      options.state = redirect;
    }

    return options;
  }
}


