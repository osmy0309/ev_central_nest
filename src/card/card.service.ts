import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Card } from './entities/card.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { asingCardDto, createCardDto, updateCardDto } from './dto/card.dto';
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

  async create(card: createCardDto): Promise<Card> {
    /*const userFind = await this.userRepository.find({
      where: { id },
    });*/

    const cardFind = await this.cardRepository.findOne({
      where: {
        no_serie: card.no_serie,
      },
    });
    if (cardFind) {
      throw new HttpException('CARD_EXIST', HttpStatus.CONFLICT);
    }

    //card.user = userFind[0];
    const newCard = this.cardRepository.create(card);
    // await this.userRepository.save(userFind[0]);
    return await this.cardRepository.save(newCard);
  }

  async asingCard(asing: asingCardDto): Promise<Card> {
    const userFind = await this.userRepository.find({
      where: { id: asing.id_user },
    });

    const relation = await this.dataSource
      .createQueryBuilder()
      .select('card')
      .from(Card, 'card')
      .leftJoinAndSelect('card.user', 'user')
      .where('card.id = :id', { id: asing.id_card })
      .getMany();

    if (relation[0].user) throw new HttpException('CARD_IN_USED', 400);
    if (userFind.length == 0) {
      throw new HttpException('USER_NOT_EXIST', 400);
    } else {
      userFind[0].password = '';
      const cardFind = await this.cardRepository.findOne({
        where: {
          id: asing.id_card,
        },
      });
      if (!cardFind) {
        throw new HttpException('CARD_NOT_EXIST', HttpStatus.CONFLICT);
      }

      cardFind.user = userFind[0];
      return await this.patchCards(cardFind, asing.id_card, asing.id_user);
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

  async deleteCard(id: number): Promise<{ success: boolean }> {
    const card = await this.cardRepository.delete({ id });
    if (card.affected === 0) {
      throw new HttpException('CARD_NOT_FOUND', 400);
    }
    return { success: true };
  }
}
