import { Injectable, HttpException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Charge } from './entities/charge.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { createChargerDto, updateUserDto } from './dto/charge.dto';
import { Card_Charge } from './entities/card_charge.entity';
import {
  createCard_ChargerDto,
  deleteCard_ChargerDto,
} from './dto/card_charge.dto';
import { Card } from 'src/card/entities/card.entity';
import { Company } from 'src/client/entities/client.entity';
import { Client } from 'rpc-websockets';

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
      .select(['charge', 'company.id'])
      .where('charge.id = :id', { id })
      .getOne();

    if (!change) {
      throw new HttpException('CHANGE_NOT_FOUND', 400);
    }

    if (change.client.id != id_company) {
      throw new HttpException('CHANGE_NOT_EXIST_IN_THIS_COMPANY', 400);
    }

    return change;
  }

  async getChargeAllAdmin(): Promise<Charge[]> {
    const change = await this.chargeRepository.find();

    if (!change) {
      throw new HttpException('CHANGE_NOT_DATA', 400);
    }

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
      throw new HttpException('CHANGE_NOT_FOUND', 400);
    }

    if (change.client.id != id_company) {
      throw new HttpException('CHANGE_NOT_EXIST_IN_THIS_COMPANY', 400);
    }

    const response = await this.chargeRepository.update({ id }, charge);
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

  async deleteCharge(id: number, id_company): Promise<Charge> {
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
      throw new HttpException('CHANGE_NOT_EXIST_IN_THIS_COMPANY', 400);
    }

    const charge = await this.chargeRepository.delete({ id });
    if (charge.affected === 0) {
      throw new HttpException('CHARGE_NOT_FOUND', 400);
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
      throw new HttpException('CLIENT_NOT_FOUND_THIS_COMPANY', 400);
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
      .getOne();

    if (!change) {
      throw new HttpException('CHANGE_NOT_FOUND', 400);
    }
    if (change.client.id != id_company) {
      {
        const flag = await this.companyIsMySon(id_company, change.client.id);
        if (!flag) throw new HttpException('THIS_CHARGE_NOT_IS_SON', 400);
      }

      return change;
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
      throw new HttpException('CHANGE_NOT_FOUND', 400);
    }

    if (change.client.id != id_company) {
      const flag = await this.companyIsMySon(id_company, change.client.id);
      if (!flag) throw new HttpException('THIS_COMPANY_NOT_IS_SON', 400);
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
  ): Promise<Card_Charge> {
    const card = await this.cardRepository.findOne({
      where: {
        id: newCard_Charge.cardId,
      },
    });

    if (!card) {
      throw new HttpException('CARD_NOT_FOUND', 400);
    }

    const charge = await this.chargeRepository.findOne({
      where: {
        id: newCard_Charge.chargeId,
      },
    });

    if (!charge) {
      throw new HttpException('CHARGE_NOT_FOUND', 400);
    }

    const relactionexist = await this.card_chargeRepository.findOne({
      where: {
        cardId: newCard_Charge.cardId,
        chargeId: newCard_Charge.chargeId,
      },
    });
    if (relactionexist) {
      throw new HttpException('RELATION_EXIST', 400);
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
      console.log(searchCardCharge);
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
}
