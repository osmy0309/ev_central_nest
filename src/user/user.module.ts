import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { Company } from 'src/client/entities/client.entity';
import { ClientService } from 'src/client/client.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Card } from 'src/card/entities/card.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { ChargeService } from 'src/charge/charge.service';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import { TimeZoneService } from 'src/time_zone/time_zone.service';
import { AuthOauthService } from 'src/auth-oauth/auth-oauth.service';

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
  controllers: [UserController],
  providers: [
    UserService,
    ClientService,
    ChargeService,
    TimeZoneService,
    AuthOauthService,
  ],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
