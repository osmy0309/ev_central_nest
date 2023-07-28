import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { createTTimeZoneDTO } from './dto/time_zone.dto';
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

    if (transactionFind.length == 0) {
      throw new HttpException('TRANSACTION_NOT_EXIST', 400);
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

    if (results.length == 0) {
      throw new HttpException('TRANSACTION_NOT_EXIST', 400);
    }
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
      throw new HttpException('TIMEZONE_NOT_EXIST', 400);
    }
    return results[0];
  }
}
