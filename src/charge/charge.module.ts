import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';
import { Card_Charge } from './entities/card_charge.entity';
import { Charge } from './entities/charge.entity';

@Module({
  providers: [ChargeService],
  imports: [TypeOrmModule.forFeature([Charge, Card_Charge, Card, Transaction])],
  controllers: [ChargeController],
  exports: [TypeOrmModule.forFeature([Charge, Card_Charge]), ChargeService],
})
export class ChargeModule {}
