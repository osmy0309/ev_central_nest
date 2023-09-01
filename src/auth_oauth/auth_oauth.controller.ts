import { Controller, Get, UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators/http';
import { AuthOauthGuard } from 'src/guards/oauth.guard';

@Controller('auth-oauth')
export class AuthOauthController {
  @Get('login')
  @UseGuards(AuthOauthGuard)
  heandleLogin() {
    return { msg: 'Autentication' };
  }

  @Get('redirect')
  @UseGuards(AuthOauthGuard)
  heandleRedirect(@Req() req: any) {
    console.log('HERE------------', req.user, '-------------');
    return req.user;
  }
}
