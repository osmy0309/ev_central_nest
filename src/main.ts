import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

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
  await app.listen(3800);
}
bootstrap();
