import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DataSource, In } from 'typeorm';
import { Card } from './entities/card.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { asingCardDto, createCardDto, updateCardDto } from './dto/card.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { userLoginDto } from 'src/gralDTO/userLogin.dto';
import { Company } from 'src/client/entities/client.entity';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private userService: UserService,
    @InjectDataSource()
    private dataSource: DataSource,
    private clientService: ClientService,
  ) {}

  async create(card: createCardDto, user: userLoginDto): Promise<Card> {
    const cardFind = await this.cardRepository.findOne({
      where: {
        no_serie: card.no_serie,
      },
    });
    if (cardFind) {
      throw new HttpException('CARD_EXIST', HttpStatus.CONFLICT);
    }

    const companyToAsing = await this.companyRepository.findOne({
      where: {
        id: user.company,
      },
    });
    card.company = companyToAsing;
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
    console.log(relation);

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
      if (relation[0].user) throw new HttpException('CARD_IN_USED', 400);
      cardFind.user = userFind[0];
      return await this.patchCards(
        cardFind,
        asing.id_card,
        asing.id_user,
        true,
      );
    }
  }

  async getAllCards(user: userLoginDto): Promise<Object> {
    let myCompany = [];
    let arrayallcompany = [];
    let results = [];
    function addCompanies(companies) {
      for (const company of companies) {
        arrayallcompany.push({ ...company }); // Add the company as a charger

        if (company.company_son) {
          // Check if it has child companies
          addCompanies(company.company_son); // Recursively add the child companies
        }
      }
    }
    const companies_son = await this.clientService.getMyClientsTree(
      user.company,
      user.roles,
    );

    if (!companies_son.status) myCompany = companies_son; //----En caso de que no tenga comañias hijas
    myCompany.push({ id: user.company, name: 'My Company' } as Company);
    addCompanies(myCompany);
    for (const company of arrayallcompany) {
      const cards = await this.cardRepository
        .createQueryBuilder('card')
        .leftJoinAndSelect('card.user', 'user')
        .select([
          'card',
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.dni',
          'user.username',
        ])
        .where('card.companyId = :id', { id: company.id })
        .getMany();
      if (cards.length == 0) continue;

      for (const card of cards) {
        results.push(card);
      }
    }
    return results;
  }

  async getCardsByUserAutentication(id: number): Promise<Object> {
    const results = await this.dataSource
      .createQueryBuilder()
      .select('card')
      .from(Card, 'card')
      //.leftJoinAndSelect("enterprise.user", "id")
      .where('userId = :id', { id })
      .getMany();

    return results;
  }

  async patchCards(
    card: updateCardDto,
    idcard: number,
    id: number,
    midifyUser: boolean,
  ): Promise<Card> {
    const cardToUpdate = await this.dataSource
      .createQueryBuilder()
      .select('card')
      .from(Card, 'card')
      .where('id = :id', { id: idcard })
      .getOne(); // Cambiar de getMany() a getOne()

    if (!cardToUpdate) {
      throw new HttpException('Card_not_found', 400);
    }
    if (midifyUser) {
      const user = await this.dataSource
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('id = :id', { id })
        .getOne(); // Cambiar de getMany() a getOne()

      if (!user) {
        throw new HttpException('USER_NOT_FOUND', 400);
      }
      cardToUpdate.user = user;
    }

    cardToUpdate.no_serie = card.no_serie;
    cardToUpdate.credit = card.balance;
    cardToUpdate.idTarjetaPadre = card.idTarjetaPadre;

    return await this.cardRepository.save(cardToUpdate);
  }

  async deleteCard(id: number): Promise<{ success: boolean }> {
    const card = await this.cardRepository.delete({ id });
    if (card.affected === 0) {
      // throw new HttpException('CARD_NOT_FOUND', 400);
      return { success: false };
    }
    return { success: true };
  }
}
