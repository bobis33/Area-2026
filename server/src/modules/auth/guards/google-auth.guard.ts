import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const redirect =
      (request.query?.redirect as string | undefined) ||
      (request.body?.redirect as string | undefined) ||
      undefined;

    const options: any = {};

    if (redirect) {
      options.state = redirect;
    }

    return options;
  }
}

