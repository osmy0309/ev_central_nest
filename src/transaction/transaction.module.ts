import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  providers: [TransactionService],
  imports: [
    forwardRef(() => Charge),
    forwardRef(() => Card),
    TypeOrmModule.forFeature([Charge, Card, Transaction]),
  ],
  controllers: [TransactionController],
  exports: [TypeOrmModule.forFeature([Transaction])],
})
export class TransactionModule {}
