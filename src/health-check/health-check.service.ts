import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  async HealthCheck(): Promise<number> {
    return 200;
  }
}
