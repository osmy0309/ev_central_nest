import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthOauthService } from '../auth-oauth/auth-oauth.service';
import { Request } from 'express';
import { tokendDto } from 'src/auth-oauth/dto/token.dto';
import { UserService } from 'src/user/user.service';
import { createUserDto } from 'src/user/dto/create-user.dto';
@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private authService: AuthOauthService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const objectToken = new tokendDto();
    objectToken.token = token;

    const resultValidate = await this.authService.validateToken(objectToken);
    console.log(resultValidate);
    if (resultValidate == false) throw new HttpException('NOT_AUTHORIZED', 400);
    else {
      //console.log('resultValidate', resultValidate);
      const validateEmail = await this.userService.getUserByUserEmail(
        resultValidate.user.email,
      );
      if (validateEmail == null) {
        const createUser = new createUserDto();
        createUser.dni = '1';
        createUser.email = resultValidate.user.email;
        createUser.firstName = resultValidate.user.name;
        createUser.lastName = resultValidate.user.lastName;
        createUser.roles = resultValidate.user.roles;
        createUser.username = resultValidate.user.email;
        createUser.password = '123';
        createUser.direction = '';
        this.userService.create(createUser, 1);
      }
      console.log('validateEmail', validateEmail);
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
