import { Controller } from '@nestjs/common';
import { Body, Param, Post, Get } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiTags } from '@nestjs/swagger';
import { createTTimeZoneDTO } from './dto/time_zone.dto';
import { TimeZoneService } from './time_zone.service';
@ApiTags('Time-Zone')
@Controller('time-zone')
export class TimeZoneController {
  constructor(private readonly timeZOneService: TimeZoneService) {}
  @Post(':id')
  async newTimeZone(
    @Param('id', ParseIntPipe) id: number,
    @Body() newTimeZone: createTTimeZoneDTO,
  ) {
    return await this.timeZOneService.newTimeZone(id, newTimeZone);
  }

  @Get('by_id_transaction/:id')
  async getTimeZoneByIdTransaction(@Param('id', ParseIntPipe) id: number) {
    return await this.timeZOneService.getTimeZoneByIdTransaction(id);
  }

  @Get(':id')
  async getTimeZoneById(@Param('id', ParseIntPipe) id: number) {
    return await this.timeZOneService.getTimeZoneById(id);
  }
}
