import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargeService } from 'src/charge/charge.service';
import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { ClientService } from 'src/client/client.service';
import { Company } from 'src/client/entities/client.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { UserService } from 'src/user/user.service';
import { User } from '../user/entities/user.entity';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';

@Module({
  imports: [
    forwardRef(() => Transaction),
    TypeOrmModule.forFeature([
      Card,
      User,
      Company,
      Transaction,
      Charge,
      Card_Charge,
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, UserService, ClientService, ChargeService],
  exports: [TypeOrmModule.forFeature([Card])],
})
export class CardModule {}
