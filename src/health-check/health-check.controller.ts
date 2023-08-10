import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';

@ApiTags('Health-check')
@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly HealthCheckService: HealthCheckService) {}

  @Get()
  async healthcheck() {
    return await this.HealthCheckService.HealthCheck();
  }
}
