import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthOauthService } from './auth-oauth.service';
import { tokendDto } from './dto/token.dto';

@ApiTags('Auth-oauth')
@Controller('auth-oauth')
export class AuthOauthController {
  constructor(private readonly authOauthService: AuthOauthService) {}
  @Post()
  async createCard(@Body() token: tokendDto) {
    return await this.authOauthService.validateToken(token);
  }
}
