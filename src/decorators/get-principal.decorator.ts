import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { async } from 'rxjs';
import { AuthOauthService } from 'src/auth_oauth/auth_oauth.service';
import { createUserDto } from 'src/user/dto/create-user.dto';

export const GetPrincipal = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('USER------', request.user.user, '---------------');
    const authService = new AuthOauthService();

    return request.user;
  },
);
