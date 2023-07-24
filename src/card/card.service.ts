import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Card } from './entities/card.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { createCardDto } from './dto/card.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(card: createCardDto, id: number): Promise<Card> {
    const userFind = await this.userRepository.find({
      where: { id },
    });

    if (userFind.length == 0) {
      throw new HttpException('USER_NOT_EXIST', 400);
    } else {
      const cardFind = await this.cardRepository.findOne({
        //BUSCAR PARA QUE NO EXISTAN USUARIOS REPETIDOS
        where: {
          no_serie: card.no_serie,
        },
      });
      if (cardFind) {
        throw new HttpException('CARD_EXIST', HttpStatus.CONFLICT);
      }

      const newCard = this.cardRepository.create(card);
      await this.userRepository.save(userFind[0]);
      return await this.cardRepository.save(newCard);
    }
  }
}
