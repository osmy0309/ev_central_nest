import { Body, Controller, Post } from '@nestjs/common';
import { ClientOcppService } from './client_ocpp.service';
import { connectDto } from './dto/client_ocpp.dto';

@Controller('client')
export class ClientOcppController {
  constructor(private readonly clientOcppService: ClientOcppService) {}
  @Post('connect')
  async connect(@Body() newConnection: connectDto) {
    console.log(newConnection);
    return await this.clientOcppService.connect(newConnection);
  }
  @Post('heartbeat')
  async heartbeat(@Body() newConnection: connectDto) {
    return await this.clientOcppService.heartbeat(newConnection);
  }
  @Post('statusNotification')
  async statusNotification(@Body() newConnection: connectDto) {
    return await this.clientOcppService.statusNotification(newConnection);
  }

  @Post('authorizeTransaction')
  async authorizeTransaction(@Body() newConnection: connectDto) {
    return await this.clientOcppService.authorizeTransaction(newConnection);
  }
}
