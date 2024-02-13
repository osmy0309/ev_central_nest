import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () => {
      const bool = user.roles.some((element) => roles.includes(element));
      return bool;
    };

    //console.log('1', hasRole(), '2', user.roles);
    if (!user || !user.roles || !hasRole())
      throw new HttpException('ROL_NOT_AUTHORIZED', 400);

    return user && user.roles && hasRole();
  }
}
