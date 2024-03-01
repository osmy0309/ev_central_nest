import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientOcppService } from './client_ocpp.service';
import { connectDto } from './dto/client_ocpp.dto';
@ApiTags('Charges')
@Controller('client_ocpp')
export class ClientOcppController {
  constructor(private readonly clientOcppService: ClientOcppService) {}
  @Post('disableOCPPcharge')
  async disable(@Body() newConnection: connectDto) {
    return await this.clientOcppService.disabledCharge(newConnection);
  }
  @Post('enableOCPPcharge')
  async enable(@Body() newConnection: connectDto) {
    return await this.clientOcppService.enabledCharge(newConnection);
  }
  /*
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

  @Post('stopTransaction')
  async stopTransaction(@Body() newConnection: connectDto) {
    return await this.clientOcppService.stopTransaction(newConnection);
  }*/
}
