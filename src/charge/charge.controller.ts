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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createChargerDto, updateUserDto } from './dto/charge.dto';
import { Charge } from './entities/charge.entity';
import {
  createCard_ChargerDto,
  deleteCard_ChargerDto,
} from './dto/card_charge.dto';

@ApiTags('Charges')
@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}
  //@ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Post(':id_client/create')
  async createCharge(
    @Param('id_client', ParseIntPipe) id_client: number,
    @Body() newCharge: createChargerDto,
  ) {
    return await this.chargeService.create(newCharge, id_client);
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

  @ApiTags('Card-Charges')
  @Post('delete_card_change_relations')
  @ApiBody({
    description:
      'En este caso puedes pasar tanto el id de un cargador o de una tarjeta, o ambos para eliminar la relación entre ellos. En caso de colocar un solo id de cuaquiera de los dos casos se eliminan todas las relaciones existentes de ese Cargador/Tarjeta. Esto es en caso de eliminar algun cargador o tarjeta eliminar todas las relaciones existentes.',
    type: deleteCard_ChargerDto,
  })
  @ApiResponse({
    status: 200,
    description: JSON.stringify({ success: true }),
    type: Object,
  })
  async deleteRelationCardCharge(
    @Body() newCard_Charge: deleteCard_ChargerDto,
  ) {
    return await this.chargeService.deleteRelationCardCharge(newCard_Charge);
  }
}
