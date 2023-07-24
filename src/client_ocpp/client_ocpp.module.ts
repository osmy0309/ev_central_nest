import { Module } from '@nestjs/common';
import { ClientOcppController } from './client_ocpp.controller';
import { ClientOcppService } from './client_ocpp.service';

@Module({
  providers: [ClientOcppService],
  controllers: [ClientOcppController],
  exports: [ClientOcppService],
})
export class ClientOcppModule {}
