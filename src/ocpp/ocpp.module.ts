import { OcppService } from './ocpp.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [OcppService],
  exports: [OcppService],
})
export class OcppModule {}
