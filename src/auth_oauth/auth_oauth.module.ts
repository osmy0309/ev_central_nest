import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/client/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthOauthController } from './auth_oauth.controller';
import { AuthOauthService } from './auth_oauth.service';
import { SessionSerializer } from './serializer/oauth.serializer';
import { OAuth2Strategy } from './strategy/oauth2.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  controllers: [AuthOauthController],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthOauthService },
    OAuth2Strategy,
    SessionSerializer,
  ],
})
export class AuthOauthModule {}
