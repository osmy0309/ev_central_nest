import { OcppService } from './ocpp.service';
import { Module } from '@nestjs/common';
import { ClientOcppService } from '../client_ocpp/client_ocpp.service';

@Module({
  imports: [],
  providers: [OcppService, ClientOcppService],
  exports: [OcppService],
})
export class OcppModule {}
