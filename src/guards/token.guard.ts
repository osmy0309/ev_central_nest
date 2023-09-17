import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthOauthService } from '../auth-oauth/auth-oauth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthOauthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Aquí puedes realizar la lógica de autenticación utilizando el AuthService
    return this.authService.validateToken(request);
  }
}
