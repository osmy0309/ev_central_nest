import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OAuthAuthGuard extends AuthGuard('google') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const active = await super.canActivate(context);
    console.log('ACTIVE', active);
    const request = context.switchToHttp().getRequest();
    console.log('request', request);
    await super.logIn(request);
    return active;
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw new HttpException('NOT_AUTHORIZED', 401);
    }
    return user;
  }
}
