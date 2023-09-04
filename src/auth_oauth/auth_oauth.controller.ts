import { Controller, Get, UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators/http';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { OAuthAuthGuard } from 'src/guards/newguard.guard';
import { AuthOauthGuard } from 'src/guards/oauth.guard';

@Controller('auth-oauth')
export class AuthOauthController {
  @Get('login')
  @UseGuards(OAuthAuthGuard)
  heandleLogin() {
    return { msg: 'Autentication' };
  }

  @Get('redirect')
  @UseGuards(AuthOauthGuard)
  heandleRedirect(@Req() req: any, @GetPrincipal() user: any) {
    console.log('HERE------------', req.user, '-------------');
    return req.user;
  }
}
