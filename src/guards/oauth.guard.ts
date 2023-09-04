import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthOauthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    console.log('ACTIVE', activate);
    const request = context.switchToHttp().getRequest();
    console.log('request', request);
    await super.logIn(request);
    return activate;
  }
}
