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
import { RolService } from './rol/rol.service';
import { RolModule } from './rol/rol.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './rol/app.roles';
import { ChargeController } from './charge/charge.controller';
import { ChargeModule } from './charge/charge.module';
import { TransactionService } from './transaction/transaction.service';
import { TransactionModule } from './transaction/transaction.module';
import { TimeZoneController } from './time_zone/time_zone.controller';
import { TimeZoneService } from './time_zone/time_zone.service';
import { TimeZoneModule } from './time_zone/time_zone.module';
import { ChargeService } from './charge/charge.service';
import { TransactionController } from './transaction/transaction.controller';
import { UserController } from './user/user.controller';
import { UserseederModule } from './userseeder/userseeder.module';
import { UserSeederService } from './userseeder/userseeder.service';
import { ClientModule } from './client/client.module';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'ev_central_nest',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AccessControlModule.forRoles(roles),
    AuthModule,
    OcppModule,
    ClientOcppModule,
    UserModule,
    CardModule,
    RolModule,
    ChargeModule,
    TransactionModule,
    TimeZoneModule,
    UserseederModule,
    ClientModule,
    HealthCheckModule,
  ],
  controllers: [
    AppController,
    ClientOcppController,
    CardController,
    ChargeController,
    TimeZoneController,
    TransactionController,
    UserController,
  ],
  providers: [
    AppService,
    OcppService,
    ClientOcppService,
    CardService,
    RolService,
    TransactionService,
    TimeZoneService,
    ChargeService,
    UserSeederService,
  ],
})
export class AppModule {}
