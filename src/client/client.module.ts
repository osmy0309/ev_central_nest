import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Company } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [TypeOrmModule.forFeature([Company]), ClientService],
})
export class ClientModule {}
