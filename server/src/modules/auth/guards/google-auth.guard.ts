import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const redirect = (req.query?.redirect as string | undefined) || undefined;

    const options: Record<string, any> = {
      // Preserve default Google OAuth scopes
      scope: ['profile', 'email'],
    };

    if (redirect) {
      // Use OAuth "state" parameter to transport the mobile redirect URL
      // The provider will return this state value in the callback
      options.state = redirect;
    }

    return options;
  }
}


