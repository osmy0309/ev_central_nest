import { Controller, Get } from '@nestjs/common';

@Controller('ocpp')
export class OcppController {
  @Get()
  healthCheck(): string {
    return 'Server OCPP is running';
  }
}
