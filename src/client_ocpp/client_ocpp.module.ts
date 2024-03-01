import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { ChargeService } from 'src/charge/charge.service';
import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { ClientService } from 'src/client/client.service';
import { Company } from 'src/client/entities/client.entity';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { ClientOcppController } from './client_ocpp.controller';
import { ClientOcppService } from './client_ocpp.service';
import { CardModule } from 'src/card/card.module';
import { TimeZoneModule } from 'src/time_zone/time_zone.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  providers: [
    ClientOcppService, 
    ChargeService, 
    ClientService, 
  ],
  controllers: [ClientOcppController],
  exports: [ClientOcppService],
  imports: [
    CardModule,
    TimeZoneModule,
    TransactionModule,
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
})
export class ClientOcppModule {}
