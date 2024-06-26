import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { OcppService } from './ocpp/ocpp.service';
import * as dotenv from 'dotenv';
import { LoggerService } from './services/logger/logger.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const config = new DocumentBuilder()

    .setTitle('API EV CENTRAL NEST')
    .addBearerAuth()
    .setDescription('')
    .setVersion('1.0')
    .addTag('connect OCPP')
    .addTag('User')
    .addTag('Autentication')
    .addTag('Card-Charges')
    .addTag('Time-Zone')
    .addTag('Health-check')
    .addTag('Charges')
    .addTag('Company')
    .addTag('Auth-oauth')
    .build();

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  const ocppService = app.get(OcppService);
  ocppService.startServer();

  await app.listen(3800);
}
bootstrap();
