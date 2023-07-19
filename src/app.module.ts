import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcppService } from './ocpp/ocpp.service';
import { OcppModule } from './ocpp/ocpp.module';
import { ClientOcppController } from './client_ocpp/client_ocpp.controller';
import { ClientOcppModule } from './client_ocpp/client_ocpp.module';
import { ClientOcppService } from './client_ocpp/client_ocpp.service';

@Module({
  imports: [OcppModule, ClientOcppModule],
  controllers: [AppController, ClientOcppController],
  providers: [AppService, OcppService, ClientOcppService],
})
export class AppModule {}
