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
import { Response } from 'express';
import { createObjectCsvStringifier, createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import { Card_Charge } from 'src/charge/entities/card_charge.entity';

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
    @InjectRepository(Card_Charge)
    private card_chargeRepository: Repository<Card_Charge>,
    @InjectDataSource()
    private dataSource: DataSource,
    private clientService: ClientService,
  ) {}

  async create(card: createCardDto, user: userLoginDto): Promise<Card> {
    const cardFind = await this.cardRepository.findOne({
      where: {
        no_serie: card.no_serie.trim(),
        isActive: true,
      },
    });
    if (cardFind) {
      throw new HttpException('CARD_EXIST', 403);
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
    if (asing.id_user == 0) {
      const cardrelation = await this.dataSource
        .createQueryBuilder()
        .select('card')
        .from(Card, 'card')
        .leftJoinAndSelect('card.user', 'user')
        .where('card.id = :id', { id: asing.id_card })
        .getMany();
      if (cardrelation.length == 0) return {} as Card;
      let cardModify = cardrelation[0];
      cardModify.user = null;
      const response = await this.cardRepository.update(
        { id: asing.id_card },
        cardModify,
      );
      if (response.affected !== 0) {
        return cardModify;
      }
    }

    const userFind = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'client')
      .select(['user', 'client'])
      .where('user.id = :id', { id: asing.id_user })
      .getMany();

    /*  const relation = await this.dataSource
      .createQueryBuilder()
      .select('card')
      .from(Card, 'card')
      .leftJoinAndSelect('card.user', 'user')
      .where('card.id = :id', { id: asing.id_card })
      .getMany();*/

    if (!userFind) {
      return {} as Card;
    } else {
      userFind[0].password = '';
      const cardFind = await this.cardRepository.findOne({
        where: {
          id: asing.id_card,
        },
      });
      if (!cardFind) {
        return {} as Card;
      }

      const companyFind = await this.companyRepository.find({
        where: { id: userFind[0].client.id },
      });
      // if (relation[0].user) return {} as Card;
      cardFind.user = userFind[0];
      cardFind.company = companyFind[0];

      return await this.patchCards(
        cardFind,
        asing.id_card,
        asing.id_user,
        true,
      );
    }
  }

  async getAllCardsById(idcard: number, user: userLoginDto): Promise<Object> {
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
          'user.isActive',
          'user.email',
          'user.dni',
          'user.username',
        ])
        .where('card.companyId = :id', { id: company.id })
        .andWhere('card.id = :idbus', { idbus: idcard })
        .andWhere('card.isActive = :flag', { flag: true })
        .getOne();
      if (!cards) continue;

      return cards;
    }
    return {} as Card;
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
    const bool = user.roles.some((element) => ['ADMIN'].includes(element));
    if (bool) {
      if (!companies_son.status) myCompany = companies_son; //----En caso de que no tenga comañias hijas
    }

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
          'user.isActive',
          'user.email',
          'user.dni',
          'user.username',
        ])
        .where('card.companyId = :id', { id: company.id })
        .andWhere('card.isActive = :flag', { flag: true })
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
      return {} as Card;
    }

    const cardFind = await this.cardRepository.findOne({
      where: {
        no_serie: card.no_serie.trim(),
        isActive: true,
      },
    });
    if (cardFind && cardFind.id != idcard) {
      throw new HttpException('CARD_EXIST', 403);
    }
    if (midifyUser) {
      const user = await this.dataSource
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('id = :id', { id })
        .getOne(); // Cambiar de getMany() a getOne()

      if (!user) {
        return {} as Card;
      }
      cardToUpdate.user = user;
    }

    cardToUpdate.no_serie = card.no_serie;
    cardToUpdate.credit = card.credit;
    cardToUpdate.company = card.company;
    cardToUpdate.idTarjetaPadre = card.idTarjetaPadre;

    return await this.cardRepository.save(cardToUpdate);
  }

  async deleteCard(id: number): Promise<{ success: boolean }> {
    /*const card = await this.cardRepository.delete({ id });
    if (card.affected === 0) {
      return { success: false };
    }*/
    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set({ isActive: false, userId: null })

      .where('id = :id', { id })
      .execute();

    await this.card_chargeRepository
      .createQueryBuilder()
      .update(Card_Charge)
      .set({ cardId: null })
      .where('cardId = :id', { id })
      .execute();
    return { success: true };
  }

  async exportCardCSV(res: Response, user: any): Promise<any> {
    const listCard = await this.getAllCards(user);
    let record = [];

    for (const key in listCard) {
      record.push({
        no_serie: listCard[key].no_serie,
        credit: listCard[key].credit,
        userfirstName: listCard[key].user ? listCard[key].user.firstName : '-',
        userlastName: listCard[key].user ? listCard[key].user.lastName : '-',
        email: listCard[key].user ? listCard[key].user.email : '-',
        dni: listCard[key].user ? listCard[key].user.dni : '-',
      });
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'no_serie', title: 'Número de serie' },
        { id: 'credit', title: 'Crédito' },
        { id: 'userfirstName', title: 'Nombre Propietario' },
        { id: 'userlastName', title: 'Apellidos Propietario' },
        { id: 'email', title: 'Correo Electrónico' },
        { id: 'dni', title: 'DNI' },
      ],
      fieldDelimiter: ';',
    });

    const csvString =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(record);

    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename=card.csv');
    res.send(csvString);
  }
  async exportCardCSVEn(res: Response, user: any): Promise<any> {
    const listCard = await this.getAllCards(user);
    let record = [];

    for (const key in listCard) {
      record.push({
        no_serie: listCard[key].no_serie,
        credit: listCard[key].credit,
        userfirstName: listCard[key].user ? listCard[key].user.firstName : '-',
        userlastName: listCard[key].user ? listCard[key].user.lastName : '-',
        email: listCard[key].user ? listCard[key].user.email : '-',
        dni: listCard[key].user ? listCard[key].user.dni : '-',
      });
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'no_serie', title: 'Box ID' },
        { id: 'credit', title: 'Credit' },
        { id: 'userfirstName', title: 'Owner Name' },
        { id: 'userlastName', title: 'Owner Surnames' },
        { id: 'email', title: 'Email' },
        { id: 'dni', title: 'DNI' },
      ],
      fieldDelimiter: ';',
    });

    const csvString =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(record);

    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename=card.csv');
    res.send(csvString);
  }

  async getChargeBySerial(id: string): Promise<Card> {
    const card = await this.cardRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.company', 'company')
      .leftJoinAndSelect('card.card_charge', 'card_charge')
      .leftJoinAndSelect('card.transaction', 'transaction')
      .leftJoinAndSelect('card.user', 'user')
      .select(['card', 'card_charge', 'transaction', 'company', 'user'])
      .where('card.no_serie = :id', { id })
      .andWhere('card.isActive = :flag', { flag: true })
      .getOne();
    return card;
  }
}
