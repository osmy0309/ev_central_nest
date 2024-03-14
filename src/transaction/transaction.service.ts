import { Injectable, HttpException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import {
  createTrasactionDto,
  updateTrasactionDto,
  deleteTrasactionDto,
  filterTrasactionDto,
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
  async filterTransaction(
    newTransaction: filterTrasactionDto,
  ): Promise<Transaction[]> {
    let queryBuilder = this.trasactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.charge', 'charge')
      .leftJoinAndSelect('transaction.timezones', 'timezone')
      .leftJoinAndSelect('transaction.card', 'card')
      .leftJoinAndSelect('transaction.user', 'user')
      .select([
        'charge',
        'transaction',
        'card',
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'timezone',
      ]);

    if (newTransaction.chargeId) {
      queryBuilder = queryBuilder.where('transaction.chargeId = :chargeId', {
        chargeId: newTransaction.chargeId,
      });
    } else if (newTransaction.cardId) {
      queryBuilder = queryBuilder.where('transaction.cardId = :cardId', {
        cardId: newTransaction.cardId,
      });
    } else if (newTransaction.userId) {
      queryBuilder = queryBuilder.where('transaction.userId = :userId', {
        userId: newTransaction.userId,
      });
    } else {
      // Si ninguno de los campos está presente en newTransaction, puedes manejarlo según tus necesidades
      // Por ejemplo, puedes lanzar una excepción o devolver un mensaje de error.
      throw new Error('Ningún criterio de filtro proporcionado');
    }
    queryBuilder = queryBuilder.orderBy('transaction.fecha', 'DESC');
    const transaction = await queryBuilder.getMany();

    // Si necesitas manejar algún tipo de error si no se encuentra ninguna transacción, puedes hacerlo aquí

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
      if (!searchTransaction) return {};

      const charge = await this.trasactionRepository.delete({
        id: searchTransaction.id,
      });
      if (charge.affected === 0) {
        return {};
      }
      return { success: true };
    } else if (deleteTrasaction.cardId) {
      const searchTransaction = await this.trasactionRepository.find({
        where: {
          cardId: deleteTrasaction.cardId,
        },
      });

      if (searchTransaction.length == 0) return {};
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
      if (searchTransaction.length == 0) return {};

      searchTransaction.forEach(async (item) => {
        await this.trasactionRepository.delete({
          id: item.id,
        });
      });

      return { success: true };
    } else return { success: false };
  }
}
