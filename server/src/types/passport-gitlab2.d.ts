declare module 'passport-gitlab2' {
  import { Strategy as OAuth2Strategy } from 'passport-oauth2';
  import { Request } from 'express';

  export interface Profile {
    provider: string;
    id: string;
    displayName: string;
    username: string;
    profileUrl: string;
    emails?: Array<{ value: string }>;
    avatarUrl?: string;
    _raw: string;
    _json: any;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    baseURL?: string;
    authorizationURL?: string;
    tokenURL?: string;
    scope?: string | string[];
    scopeSeparator?: string;
    state?: boolean;
    passReqToCallback?: boolean;
  }

  export interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback: true;
  }

  export type VerifyCallback = (
    err?: Error | null,
    user?: any,
    info?: any,
  ) => void;

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) => void;

  export type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) => void;

  export class Strategy extends OAuth2Strategy {
    constructor(
      options: StrategyOptionsWithRequest,
      verify: VerifyFunctionWithRequest,
    );
    constructor(options: StrategyOptions, verify: VerifyFunction);

    name: string;
    userProfile(
      accessToken: string,
      done: (err?: Error | null, profile?: Profile) => void,
    ): void;
  }
}
