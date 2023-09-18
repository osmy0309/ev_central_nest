import { Module } from '@nestjs/common';
import { AuthOauthService } from './auth-oauth.service';
import { AuthOauthController } from './auth-oauth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/client/entities/client.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Card } from 'src/card/entities/card.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { User } from 'src/user/entities/user.entity';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import { ChargeService } from 'src/charge/charge.service';
import { ClientService } from 'src/client/client.service';
import { TimeZoneService } from 'src/time_zone/time_zone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Transaction,
      Card,
      Charge,
      Card_Charge,
      User,
      Timezone,
    ]),
  ],
  providers: [
    AuthOauthService,
    UserService,
    ChargeService,
    ClientService,
    TimeZoneService,
  ],
  controllers: [AuthOauthController],
})
export class AuthOauthModule {}
