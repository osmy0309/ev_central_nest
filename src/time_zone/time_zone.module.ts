import { Module, forwardRef } from '@nestjs/common';
import { TimeZoneService } from './time_zone.service';
import { TimeZoneController } from './time_zone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timezone } from './entities/time_zone.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  providers: [TimeZoneService],
  controllers: [TimeZoneController],
  imports: [TypeOrmModule.forFeature([Timezone, Transaction])],
  exports: [TypeOrmModule.forFeature([Timezone])],
})
export class TimeZoneModule {}
