import { Controller, Get } from '@nestjs/common';
import { VersionService } from './version.service';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}
  @Get()
  async version() {
    return 'V 1.0.13';
  }
}
