import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ChargeService } from './charge.service';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createChargerDto, updateUserDto } from './dto/charge.dto';
import { Charge } from './entities/charge.entity';
import { createCard_ChargerDto } from './dto/card_charge.dto';

@ApiTags('Charges')
@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}
  //@ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Post('create')
  async createCharge(@Body() newCharge: createChargerDto) {
    return await this.chargeService.create(newCharge);
  }

  @Get(':id')
  async getChargeById(@Param('id', ParseIntPipe) id: number): Promise<Charge> {
    return await this.chargeService.getChargeById(id);
  }
  @Get()
  async getChargeAllAdmin(): Promise<Charge[]> {
    return await this.chargeService.getChargeAllAdmin();
  }

  @Patch(':id')
  async updateCharge(
    @Param('id', ParseIntPipe) id: number,
    @Body() chargeModify: updateUserDto,
  ) {
    return await this.chargeService.patchCharge(chargeModify, id);
  }
  @ApiTags('Card-Charges')
  @Post('new_card_charge')
  async newCard_Charge(@Body() newCard_Charge: createCard_ChargerDto) {
    return await this.chargeService.newCard_Charge(newCard_Charge);
  }
  @ApiTags('Card-Charges')
  @Post('changestate')
  async changeStateCard_Charge(@Body() newCard_Charge: createCard_ChargerDto) {
    return await this.chargeService.changeStateCard_Charge(newCard_Charge);
  }
}
