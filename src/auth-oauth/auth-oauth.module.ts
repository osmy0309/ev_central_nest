import { Module } from '@nestjs/common';
import { AuthOauthService } from './auth-oauth.service';
import { AuthOauthController } from './auth-oauth.controller';

@Module({
  providers: [AuthOauthService],
  controllers: [AuthOauthController]
})
export class AuthOauthModule {}
