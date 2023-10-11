import { Injectable, HttpException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Charge } from './entities/charge.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { createChargerDto, updateUserDto } from './dto/charge.dto';
import { Card_Charge } from './entities/card_charge.entity';
import { RPCServer, createRPCError, RPCClient } from 'ocpp-rpc';
import {
  createCard_ChargerDto,
  deleteCard_ChargerDto,
} from './dto/card_charge.dto';
import { Card } from 'src/card/entities/card.entity';
import { Company } from 'src/client/entities/client.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { ClientService } from 'src/client/client.service';
import { TimeZoneService } from 'src/time_zone/time_zone.service';
import { Response } from 'express';
import { createObjectCsvStringifier, createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Charge)
    private chargeRepository: Repository<Charge>,
    @InjectRepository(Card_Charge)
    private card_chargeRepository: Repository<Card_Charge>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(Company) private clientRepository: Repository<Company>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private clientService: ClientService,
    //private timeZoneService: TimeZoneService,

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(charge: createChargerDto, id_client: number): Promise<Charge> {
    const client = await this.clientRepository.findOne({
      where: {
        id: id_client,
      },
    });
    if (!client) {
      throw new HttpException('CLIENT_NOT_EXIST', 400);
    }

    const chargeFind = await this.chargeRepository.findOne({
      where: {
        serial_number: charge.serial_number,
      },
    });
    if (chargeFind) {
      throw new HttpException('CHARGE_EXIST', 400);
    }
    charge.client = client;
    await this.clientRepository.save(client);
    const newCHARGE = this.chargeRepository.create(charge);
    return await this.chargeRepository.save(newCHARGE);
  }

  async getChargeById(id: number, id_company: number): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'company')
      .leftJoinAndSelect('charge.transaction', 'transaction')
      .leftJoinAndSelect('transaction.card', 'card')
      .leftJoinAndSelect('card.user', 'user')
      .leftJoinAndSelect('transaction.timezones', 'timezone')
      .select([
        'charge',
        'company.id',
        'transaction',
        'card',
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.id',
        'timezone',
      ])
      .where('charge.id = :id', { id })
      .getOne();

    if (!change) {
      //throw new HttpException('CHANGE_NOT_FOUND', 400);
      return {} as Charge;
    }

    /*  if (change.client.id != id_company) {
      //throw new HttpException('CHANGE_NOT_EXIST_IN_THIS_COMPANY', 400);
      return {} as Charge;
    }*/

    return change;
  }

  async getChargeBySerial(id: string): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'client')
      .select(['charge', 'client'])
      .where('charge.serial_number = :id', { id })
      .getOne();

    if (!change) {
      //throw new HttpException('CHANGE_NOT_FOUND', 400);
      return {} as Charge;
    }

    return change;
  }

  async getChargeAllAdmin(id_company: number, rol): Promise<any[]> {
    let arrayallcompany = [];
    let myCompany = [];
    let updatedChange = [];
    const companies_son = await this.clientService.getMyClientsTree(
      id_company,
      rol,
    );
    function addCompanies(companies) {
      for (const company of companies) {
        arrayallcompany.push({ ...company }); // Add the company as a charger

        if (company.company_son) {
          // Check if it has child companies
          addCompanies(company.company_son); // Recursively add the child companies
        }
      }
    }

    if (!companies_son.status) myCompany = companies_son; //----En caso de que no tenga comañias hijas
    myCompany.push({ id: id_company, name: 'My Company' } as Company);
    addCompanies(myCompany);
    for (const itemcompa of arrayallcompany) {
      const change = await this.chargeRepository
        .createQueryBuilder('charge')
        .leftJoinAndSelect('charge.client', 'company')
        .leftJoinAndSelect('charge.transaction', 'transaction')
        .leftJoinAndSelect('transaction.card', 'card')
        .leftJoinAndSelect('card.user', 'user')
        .leftJoinAndSelect('transaction.timezones', 'timezone')
        .select([
          'charge',
          'company.id',
          'transaction',
          'card',
          'user.id',
          'user.username',
          'user.email',
          'user.firstName',
          'user.lastName',
          'user.id',
          'timezone',
        ])
        .where('company.id = :id_company', { id_company: itemcompa.id })
        .getMany();

      if (change.length == 0) {
        continue;
      }

      console.log('TRANSACTION', change);

      updatedChange = updatedChange.concat(change);
    }

    return updatedChange;
  }

  async updateStateChargeGeneral(id: number, state: number): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'company')
      .select(['charge', 'company.id'])
      .where('charge.id = :id', { id })
      .getOne();
    if (!change) {
      //throw new HttpException('CHANGE_NOT_FOUND', 400);
      return {} as Charge;
    }
    change.state = state;

    await this.chargeRepository.update({ id }, change);

    return change;
  }

  async patchCharge(
    charge: updateUserDto,
    id: number,
    id_company: number,
  ): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'company')
      .select(['charge', 'company.id'])
      .where('charge.id = :id', { id })
      .getOne();

    if (!change) {
      //throw new HttpException('CHANGE_NOT_FOUND', 400);
      return {} as Charge;
    }

    if (change.client.id != id_company) {
      throw new HttpException('CHANGE_NOT_EXIST_IN_THIS_COMPANY', 400);
      return {} as Charge;
    }

    const response = await this.chargeRepository.update({ id }, charge);
    if (response.affected === 0) {
      throw new HttpException('CHARGE_NOT_MODIFY', 400);
    }

    const updatedCharge = await this.chargeRepository.findOne({
      where: {
        id,
      },
    });

    return updatedCharge;
  }

  async deleteCharge(id: number, id_company): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'company')
      .select(['charge', 'company.id'])
      .where('charge.id = :id', { id })
      .getOne();

    if (change.client.id != id_company) {
      //throw new HttpException('CHANGE_NOT_EXIST_IN_THIS_COMPANY', 400);
      return {} as Charge;
    }

    const charge = await this.chargeRepository.delete({ id });
    if (charge.affected === 0) {
      //throw new HttpException('CHARGE_NOT_FOUND', 400);
      return {} as Charge;
    }

    return change;
  }

  //ENPONTS PARA INTERACTUAR CON CARGADORES HIJOS
  async companyIsMySon(id_company: number, id_son: number): Promise<any> {
    async function getMyClientsTreeA(
      id_company: number,
      dataSource: any,
    ): Promise<any> {
      const companies = await dataSource
        .createQueryBuilder()
        .select('company')
        .from(Company, 'company')
        .where('id_pather = :id', { id: id_company })
        .getMany();

      for (const company of companies) {
        const children = await getMyClientsTreeA(company.id, dataSource);
        if (children.length) {
          company.company_son = children;
        }
      }

      return companies;
    }

    const treeClient = await getMyClientsTreeA(id_company, this.dataSource);
    if (treeClient.length == 0) {
      // throw new HttpException('CLIENT_NOT_FOUND_THIS_COMPANY', 400);
      return {};
    }

    async function idExistsInTree(
      data: any[],
      idToFind: number,
    ): Promise<boolean> {
      for (const item of data) {
        if (item.id === idToFind) {
          return true;
        }
        if (item.company_son) {
          const idExistsInChildren = await idExistsInTree(
            item.company_son,
            idToFind,
          );
          if (idExistsInChildren) {
            return true;
          }
        }
      }
      return false;
    }

    return await idExistsInTree(treeClient, id_son);
  }

  async createChargeSon(
    charge: createChargerDto,
    id_client: number,
    id_son: number,
  ): Promise<Charge> {
    const client = await this.clientRepository.findOne({
      where: {
        id: id_son,
      },
    });
    if (!client) {
      throw new HttpException('CLIENT_NOT_EXIST', 400);
    }
    const chargeFind = await this.chargeRepository.findOne({
      where: {
        serial_number: charge.serial_number,
      },
    });
    if (chargeFind) {
      throw new HttpException('CHARGE_EXIST', 400);
    }
    if (id_client != id_son) {
      const flag = await this.companyIsMySon(id_client, id_son);
      if (!flag) throw new HttpException('THIS_COMPANY_NOT_IS_SON', 400);
    }
    charge.client = client;
    await this.clientRepository.save(client);
    const newCHARGE = this.chargeRepository.create(charge);
    return await this.chargeRepository.save(newCHARGE);
  }

  async getChargeByIdSon(id_company: number, id_son: number): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'company')
      .select(['charge', 'company.id'])
      .where('charge.id = :id', { id: id_son })
      .getMany();

    if (!change) {
      //throw new HttpException('CHANGE_NOT_FOUND', 400);
      return {} as Charge;
    }
    if (change[0].client.id != id_company) {
      {
        const flag = await this.companyIsMySon(id_company, change[0].client.id);
        if (!flag)
          /*throw new HttpException('THIS_CHARGE_NOT_IS_SON', 400)*/ return {} as Charge;
      }

      let updatedChange = null;
      for (const [index, item] of change.entries()) {
        const transaction = await this.transactionRepository
          .createQueryBuilder('transaction')
          .leftJoinAndSelect('transaction.card', 'card')
          .leftJoinAndSelect('card.user', 'user')
          .leftJoinAndSelect('transaction.charge', 'charge')
          .select([
            'charge',
            'transaction',
            'card',
            'user.username',
            'user.id',
            'user.firstName',
            'user.lastName',
            'user.dni',
            'user.email',
          ])
          .where('charge.id = :id', { id: item.id })
          .andWhere('transaction.estado NOT IN (:...estados)', {
            estados: [3, 4],
          })

          .getMany();

        if (transaction.length > 0) {
          change[index].state = transaction[0].estado + 1;
          updatedChange = change.map((it, i) => {
            if (i == index) {
              return {
                ...it,
                //user_transaction: {},
                card_transaction: transaction[0].card,
              };
            } else {
              return {
                ...it,
                // user_transaction: null,
                card_transaction: null,
              };
            }
          });
        }
      }
      return updatedChange;
    }
  }

  async patchChargeSon(
    charge: updateUserDto,
    id: number,
    id_company: number,
  ): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'company')
      .select(['charge', 'company.id'])
      .where('charge.id = :id', { id })
      .getOne();

    if (!change) {
      //throw new HttpException('CHANGE_NOT_FOUND', 400);
      return {} as Charge;
    }

    if (change.client.id != id_company) {
      const flag = await this.companyIsMySon(id_company, change.client.id);
      if (!flag)
        //throw new HttpException('THIS_COMPANY_NOT_IS_SON', 400);
        return {} as Charge;
    }

    await this.chargeRepository.update({ id }, charge);
    /* if (response.affected === 0) {
      throw new HttpException('CHARGE_NOT_FOUND', 400);
    }*/

    const updatedCharge = await this.chargeRepository.findOne({
      where: {
        id,
      },
    });

    return updatedCharge;
  }

  async deleteChargeSon(id: number, id_company): Promise<Charge> {
    const change = await this.chargeRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.client', 'company')
      .select(['charge', 'company.id'])
      .where('charge.id = :id', { id })
      .getOne();

    if (!change) {
      throw new HttpException('CHANGE_NOT_FOUND', 400);
    }

    if (change.client.id != id_company) {
      const flag = await this.companyIsMySon(id_company, change.client.id);
      if (!flag) throw new HttpException('THIS_COMPANY_NOT_IS_SON', 400);
    }

    const charge = await this.chargeRepository.delete({ id });
    if (charge.affected === 0) {
      throw new HttpException('CHARGE_NOT_FOUND', 400);
    }

    return change;
  }

  // ENDPOINTS PARA LA TABLA RELACIONAL ENTRE TARJETA Y CARGADOR

  async newCard_Charge(
    newCard_Charge: createCard_ChargerDto,
  ): Promise<Card_Charge | HttpException> {
    const card = await this.cardRepository.findOne({
      where: {
        id: newCard_Charge.cardId,
      },
    });

    if (!card) {
      return new HttpException('CARD_NOT_FOUND', 400);
    }

    const charge = await this.chargeRepository.findOne({
      where: {
        id: newCard_Charge.chargeId,
      },
    });

    if (!charge) {
      return new HttpException('CHARGE_NOT_FOUND', 400);
    }

    const relactionexist = await this.card_chargeRepository.findOne({
      where: {
        cardId: newCard_Charge.cardId,
        chargeId: newCard_Charge.chargeId,
      },
    });
    if (relactionexist) {
      return new HttpException('RELATION_EXIST', 400);
    }
    const newRelation = this.card_chargeRepository.create(newCard_Charge);
    return await this.card_chargeRepository.save(newRelation);
  }

  async changeStateCard_Charge(
    newCard_Charge: createCard_ChargerDto,
  ): Promise<Card_Charge> {
    const relactionexist = await this.card_chargeRepository.findOne({
      where: {
        cardId: newCard_Charge.cardId,
        chargeId: newCard_Charge.chargeId,
      },
    });
    if (!relactionexist) {
      throw new HttpException('RELATION_NOT_EXIST', 400);
    }
    relactionexist.estado = newCard_Charge.estado;
    return await this.card_chargeRepository.save(relactionexist);
  }

  async deleteRelationCardCharge(
    deleteCard_ChargerDto: deleteCard_ChargerDto,
  ): Promise<any> {
    if (deleteCard_ChargerDto.cardId && deleteCard_ChargerDto.chargeId) {
      const searchCardCharge = await this.card_chargeRepository.findOne({
        where: {
          cardId: deleteCard_ChargerDto.cardId,
          chargeId: deleteCard_ChargerDto.chargeId,
        },
      });
      if (!searchCardCharge) throw new HttpException('RELATION_NOT_EXIST', 400);
      console.log(searchCardCharge.id);
      const charge = await this.card_chargeRepository.delete({
        id: searchCardCharge.id,
      });
      if (charge.affected === 0) {
        throw new HttpException('CHARGE_NOT_FOUND', 400);
      }
      return { success: true };
    } else if (deleteCard_ChargerDto.cardId) {
      const searchCardCharge = await this.card_chargeRepository.find({
        where: {
          cardId: deleteCard_ChargerDto.cardId,
        },
      });
      if (searchCardCharge.length == 0)
        throw new HttpException('CARD_NOT_RELATION', 400);
      searchCardCharge.forEach(async (item) => {
        await this.card_chargeRepository.delete({
          id: item.id,
        });
      });
      return { success: true };
    } else if (deleteCard_ChargerDto.chargeId) {
      const cardCharges = await this.card_chargeRepository.find({
        where: {
          chargeId: deleteCard_ChargerDto.chargeId,
        },
      });
      if (cardCharges.length == 0)
        throw new HttpException('CHARGE_NOT_RELATION', 400);
      console.log(cardCharges);

      cardCharges.forEach(async (item) => {
        await this.card_chargeRepository.delete({
          id: item.id,
        });
      });

      return { success: true };
    } else throw new HttpException('CHARGEID_OR_CARDID_IS_NECESARY', 400);
  }

  async exportChargeCSV(res: Response, user: any): Promise<any> {
    const listCharge = await this.getChargeAllAdmin(user.company, user.roles);
    let record = [];
    listCharge.forEach((item) => {
      record.push({
        nombre: item.nombre,
        total_charge: item.total_charge,
        last_connection: `${item.last_connection.getDate()}/${
          item.last_connection.getMonth() + 1
        }/${item.last_connection.getFullYear()}`,
        maximum_power: item.maximum_power,
        serial_number: item.serial_number,
        address: item.address,
        municipality: item.municipality,
      });
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'nombre', title: 'Nombre' },
        { id: 'total_charge', title: 'Carga total' },
        { id: 'last_connection', title: 'Ultima conexión' },
        { id: 'maximum_power', title: 'Poder máximo' },
        { id: 'serial_number', title: 'Número de serie' },
        { id: 'address', title: 'Dirección' },
        { id: 'municipality', title: 'Municipio' },
      ],
      fieldDelimiter: ';',
    });

    const csvString =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(record);
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename=charge.csv');
    res.send(csvString);
  }
}
