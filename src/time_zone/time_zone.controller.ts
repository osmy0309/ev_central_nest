import { Controller } from '@nestjs/common';
import { Body, Param, Post, Get } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { createTTimeZoneDTO } from './dto/time_zone.dto';
import { TimeZoneService } from './time_zone.service';
@ApiTags('Time-Zone')
@Controller('time-zone')
export class TimeZoneController {
  constructor(private readonly timeZOneService: TimeZoneService) {}
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post(':id')
  async newTimeZone(
    @Param('id', ParseIntPipe) id: number,
    @Body() newTimeZone: createTTimeZoneDTO,
  ) {
    return await this.timeZOneService.newTimeZone(id, newTimeZone);
  }
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('by_id_transaction/:id')
  async getTimeZoneByIdTransaction(@Param('id', ParseIntPipe) id: number) {
    return await this.timeZOneService.getTimeZoneByIdTransaction(id);
  }
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get(':id')
  async getTimeZoneById(@Param('id', ParseIntPipe) id: number) {
    return await this.timeZOneService.getTimeZoneById(id);
  }
}
