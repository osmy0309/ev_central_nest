import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { ChargeService } from 'src/charge/charge.service';
import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { Conector } from 'src/charge/entities/conector.entity';
import { ClientService } from 'src/client/client.service';
import { Company } from 'src/client/entities/client.entity';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import { TimeZoneService } from 'src/time_zone/time_zone.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserSeederService } from './userseeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      Transaction,
      Card,
      Charge,
      Card_Charge,
      Timezone,
      Conector,
    ]),
  ],
  providers: [
    UserSeederService,
    UserService,
    ClientService,
    ChargeService,
    TimeZoneService,
  ],
})
export class UserseederModule {}
