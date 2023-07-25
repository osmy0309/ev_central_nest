import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, User])],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService, TypeOrmModule.forFeature([Card])],
})
export class CardModule {}
