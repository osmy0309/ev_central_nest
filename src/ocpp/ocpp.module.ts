import { OcppService } from './ocpp.service';
import { Module, Global } from '@nestjs/common';
import { ClientOcppService } from '../client_ocpp/client_ocpp.service';
import { ChargeService } from 'src/charge/charge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Charge } from 'src/charge/entities/charge.entity';
import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { Card } from 'src/card/entities/card.entity';
import { Company } from 'src/client/entities/client.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import { ClientService } from 'src/client/client.service';
import { TimeZoneService } from 'src/time_zone/time_zone.service';
import { CardService } from 'src/card/card.service';
import { UserService } from 'src/user/user.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Conector } from 'src/charge/entities/conector.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Charge,
      Card_Charge,
      Card,
      Company,
      Transaction,
      User,
      Timezone,
      Conector,
    ]),
  ],
  providers: [
    OcppService,
    ClientOcppService,
    ChargeService,
    ClientService,
    TimeZoneService,
    CardService,
    UserService,
    TransactionService,
  ],
  exports: [OcppService],
  controllers: [],
})
export class OcppModule {}
