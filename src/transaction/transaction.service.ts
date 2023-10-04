import { Injectable, HttpException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import {
  createTrasactionDto,
  updateTrasactionDto,
  deleteTrasactionDto,
} from './dto/transaction.dto';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from './entities/transaction.entity';
import { Charge } from 'src/charge/entities/charge.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Charge)
    private chargeRepository: Repository<Charge>,
    @InjectRepository(Transaction)
    private trasactionRepository: Repository<Transaction>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async newTransaction(
    newTransaction: createTrasactionDto,
  ): Promise<Transaction> {
    const card = await this.cardRepository.findOne({
      where: {
        id: newTransaction.cardId,
      },
    });

    if (!card) {
      //return new HttpException('CARD_NOT_FOUND', 400);
      return {} as Transaction;
    }

    const charge = await this.chargeRepository.findOne({
      where: {
        id: newTransaction.chargeId,
      },
    });

    if (!charge) {
      //return new HttpException('CHARGE_NOT_FOUND', 400);
      return {} as Transaction;
    }

    /*if (relactionexist) {
      //return new HttpException('RELATION_EXIST', 400);
      await this.changeStatenewTransaction(newTransaction);
    }*/
    const newRelation = this.trasactionRepository.create(newTransaction);
    const save = await this.trasactionRepository.save(newRelation);

    const transaction = await this.trasactionRepository.findOne({
      where: {
        id: save.id,
      },
    });
    await this.trasactionRepository.save(newRelation);
    return transaction;
  }
  async getTransaction(id: number): Promise<Transaction> {
    const transaction = await this.trasactionRepository.findOne({
      where: {
        id,
      },
    });
    return transaction;
  }
  // ENDPOINTS PARA LA TABLA RELACIONAL ENTRE TARJETA Y CARGADOR
  async changeStatenewTransaction(
    newTransaction: updateTrasactionDto,
  ): Promise<Transaction> {
    const relactionexist = await this.trasactionRepository.findOne({
      where: {
        id: newTransaction.id,
      },
    });
    /* if (!relactionexist) {
      return new HttpException('RELATION_NOT_EXIST', 400);
    }*/
    relactionexist.estado = newTransaction.estado;

    await this.trasactionRepository.update(
      { id: relactionexist.id },
      relactionexist,
    );
    const transaction = await this.trasactionRepository.findOne({
      where: {
        id: relactionexist.id,
      },
    });
    return transaction;
  }

  async deleteRelationTrasaction(
    deleteTrasaction: deleteTrasactionDto,
  ): Promise<any> {
    if (deleteTrasaction.cardId && deleteTrasaction.chargeId) {
      const searchTransaction = await this.trasactionRepository.findOne({
        where: {
          cardId: deleteTrasaction.cardId,
          chargeId: deleteTrasaction.chargeId,
        },
      });
      if (!searchTransaction)
        throw new HttpException('RELATION_NOT_EXIST', 400);

      const charge = await this.trasactionRepository.delete({
        id: searchTransaction.id,
      });
      if (charge.affected === 0) {
        throw new HttpException('CHARGE_NOT_FOUND', 400);
      }
      return { success: true };
    } else if (deleteTrasaction.cardId) {
      const searchTransaction = await this.trasactionRepository.find({
        where: {
          cardId: deleteTrasaction.cardId,
        },
      });

      if (searchTransaction.length == 0)
        throw new HttpException('CARD_NOT_RELATION', 400);
      searchTransaction.forEach(async (item) => {
        await this.trasactionRepository.delete({
          id: item.id,
        });
      });
      return { success: true };
    } else if (deleteTrasaction.chargeId) {
      const searchTransaction = await this.trasactionRepository.find({
        where: {
          chargeId: deleteTrasaction.chargeId,
        },
      });
      if (searchTransaction.length == 0)
        throw new HttpException('CHARGE_NOT_RELATION', 400);

      searchTransaction.forEach(async (item) => {
        await this.trasactionRepository.delete({
          id: item.id,
        });
      });

      return { success: true };
    } else throw new HttpException('CHARGEID_OR_CARDID_IS_NECESARY', 400);
  }
}
