import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Card } from './entities/card.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { createCardDto, updateCardDto } from './dto/card.dto';
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
        where: {
          no_serie: card.no_serie,
        },
      });
      if (cardFind) {
        throw new HttpException('CARD_EXIST', HttpStatus.CONFLICT);
      }
      console.log(card);
      card.user = userFind[0];
      const newCard = this.cardRepository.create(card);
      await this.userRepository.save(userFind[0]);
      return await this.cardRepository.save(newCard);
    }
  }

  async getCards(id: number): Promise<Object> {
    console.log(id);
    const results = await this.dataSource
      .createQueryBuilder()
      .select('card')
      .from(Card, 'card')
      //.leftJoinAndSelect("enterprise.user", "id")
      .where('userId = :id', { id })
      .getMany();

    if (results.length == 0) {
      throw new HttpException('NO_DATA', 400);
    }

    return { results };
  }

  async patchCards(
    card: updateCardDto,
    idcard: number,
    id: number,
  ): Promise<Card> {
    const cardToUpdate = await this.dataSource
      .createQueryBuilder()
      .select('card')
      .from(Card, 'card')
      .where('id = :id', { id: idcard })
      .getOne(); // Cambiar de getMany() a getOne()
    console.log(id);

    if (!cardToUpdate) {
      throw new HttpException('Card_not_found', 400);
    }

    const user = await this.dataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('id = :id', { id })
      .getOne(); // Cambiar de getMany() a getOne()

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', 400);
    }

    console.log(cardToUpdate.id);
    cardToUpdate.no_serie = card.no_serie;
    cardToUpdate.balance = card.balance;
    cardToUpdate.idTarjetaPadre = card.idTarjetaPadre;
    cardToUpdate.user = user;

    return await this.cardRepository.save(cardToUpdate);
  }

  async deleteCard(id: number): Promise<any> {
    const card = await this.cardRepository.delete({ id });
    if (card.affected === 0) {
      return new HttpException('CARD_NOT_FOUND', 400);
    }
    return card;
  }
}
