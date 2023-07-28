import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';

@Module({
  imports: [
    forwardRef(() => Transaction),
    TypeOrmModule.forFeature([Card, User]),
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [TypeOrmModule.forFeature([Card])],
})
export class CardModule {}
