import { Module } from '@nestjs/common';
import { TimeZoneService } from './time_zone.service';
import { TimeZoneController } from './time_zone.controller';

@Module({
  providers: [TimeZoneService],
  controllers: [TimeZoneController],
  exports: [],
})
export class TimeZoneModule {}
