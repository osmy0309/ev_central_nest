import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { createTTimeZoneDTO, updateTTimeZoneDTO } from './dto/time_zone.dto';
import { Timezone } from './entities/time_zone.entity';

@Injectable()
export class TimeZoneService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(Timezone)
    private timeRepository: Repository<Timezone>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async newTimeZone(
    id: number,
    newTimeZone: createTTimeZoneDTO,
  ): Promise<Timezone> {
    const transactionFind = await this.transactionRepository.find({
      where: { id },
    });
    const resultsExistTranfer = await this.dataSource
      .createQueryBuilder()
      .select('timezone')
      .from(Timezone, 'timezone')
      //.leftJoinAndSelect("enterprise.user", "id")
      .where('transactionId = :id', { id })
      .getMany();

    if (resultsExistTranfer.length > 0) {
      return {} as Timezone;
    }

    newTimeZone.transaction = transactionFind[0];
    const newTimeZoneCreate = this.timeRepository.create(newTimeZone);
    return await this.timeRepository.save(newTimeZoneCreate);
  }

  async getTimeZoneByIdTransaction(id: number): Promise<Timezone[]> {
    const results = await this.dataSource
      .createQueryBuilder()
      .select('timezone')
      .from(Timezone, 'timezone')
      //.leftJoinAndSelect("enterprise.user", "id")
      .where('transactionId = :id', { id })
      .getMany();

    return results;
  }

  async getTimeZoneById(id: number): Promise<Timezone> {
    const results = await this.dataSource
      .createQueryBuilder()
      .select('timezone')
      .from(Timezone, 'timezone')
      //.leftJoinAndSelect("enterprise.user", "id")
      .where({ id })
      .getMany();

    if (results.length == 0) {
      return {} as Timezone;
    }
    return results[0];
  }

  async modifyTimeZone(
    idTransaction: number,
    newTransaction: updateTTimeZoneDTO,
  ): Promise<Timezone> {
    console.log(idTransaction);
    const results = await this.timeRepository
      .createQueryBuilder('timezone')
      .leftJoinAndSelect('timezone.transaction', 'transaction')
      .where('transaction.id = :id', { id: idTransaction })
      .getOne();
    /* if (!relactionexist) {
      return new HttpException('RELATION_NOT_EXIST', 400);
    }*/
    results.energy = newTransaction.energy;
    results.start = newTransaction.start;
    results.finish = newTransaction.finish;
    results.deltaEnergy = newTransaction.deltaEnergy;

    await this.timeRepository.update({ id: results.id }, results);
    const timeResponse = await this.timeRepository.findOne({
      where: {
        id: results.id,
      },
    });
    return timeResponse;
  }
}
