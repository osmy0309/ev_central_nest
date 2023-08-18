import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { ClientService } from 'src/client/client.service';
import { Company } from 'src/client/entities/client.entity';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import { TimeZoneService } from 'src/time_zone/time_zone.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';
import { Card_Charge } from './entities/card_charge.entity';
import { Charge } from './entities/charge.entity';

@Module({
  imports: [
    forwardRef(() => Transaction),
    TypeOrmModule.forFeature([
      Charge,
      Card_Charge,
      Card,
      Company,
      Transaction,
      User,
      Timezone,
    ]),
  ],
  controllers: [ChargeController],
  providers: [ChargeService, ClientService, TimeZoneService],
  exports: [TypeOrmModule.forFeature([Charge]), ChargeService],
})
export class ChargeModule {}
