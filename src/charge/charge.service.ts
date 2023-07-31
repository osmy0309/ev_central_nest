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
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Charge)
    private chargeRepository: Repository<Charge>,
    @InjectRepository(Card_Charge)
    private card_chargeRepository: Repository<Card_Charge>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,

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

  async getChargeById(id: number): Promise<Charge> {
    const change = await this.chargeRepository.findOne({
      where: {
        id,
      },
    });

    if (!change) {
      throw new HttpException('CHANGE_NOT_FOUND', 400);
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

  async patchCharge(charge: updateUserDto, id: number): Promise<Charge> {
    const response = await this.chargeRepository.update({ id }, charge);
    if (response.affected === 0) {
      throw new HttpException('CHARGE_NOT_FOUND', 400);
    }
    const updatedCharge = await this.chargeRepository.findOne({
      where: {
        id,
      },
    });

    return updatedCharge;
  }

  async deleteCharge(id: number): Promise<Charge> {
    const searchCharge = await this.chargeRepository.findOne({
      where: {
        id,
      },
    });
    const charge = await this.chargeRepository.delete({ id });
    if (charge.affected === 0) {
      throw new HttpException('CHARGE_NOT_FOUND', 400);
    }
    return searchCharge;
  }

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
  // ENDPOINTS PARA LA TABLA RELACIONAL ENTRE TARJETA Y CARGADOR
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
