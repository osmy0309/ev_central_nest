import { Injectable } from '@nestjs/common';
import { OcppService } from './ocpp/ocpp.service';

@Injectable()
export class AppService {
  constructor(private ocppService: OcppService) {}
  async onApplicationBootstrap() {
    await this.ocppService.startServer();
  }
  async getHello(): Promise<string> {
    await this.ocppService.startClient();
    return 'Hello World2!';
  }
}
