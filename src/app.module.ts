import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcppService } from './ocpp/ocpp.service';
import { OcppModule } from './ocpp/ocpp.module';
import { ClientOcppController } from './client_ocpp/client_ocpp.controller';
import { ClientOcppModule } from './client_ocpp/client_ocpp.module';
import { ClientOcppService } from './client_ocpp/client_ocpp.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CardController } from './card/card.controller';
import { CardService } from './card/card.service';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', //'192.168.31.100',
      port: 3306,
      username: 'osmy', //'root',
      password: 'osmy', //'AMiyares',
      database: 'ev_central_nest',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    OcppModule,
    ClientOcppModule,
    UserModule,
    CardModule,
  ],
  controllers: [AppController, ClientOcppController, CardController],
  providers: [AppService, OcppService, ClientOcppService, CardService],
})
export class AppModule {}
