import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ChargeService } from './charge.service';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createChargerDto, updateUserDto } from './dto/charge.dto';
import { Charge } from './entities/charge.entity';
import {
  createCard_ChargerDto,
  deleteCard_ChargerDto,
} from './dto/card_charge.dto';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Res } from '@nestjs/common/decorators/http';
import { Response } from 'express';

@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Get('exportCSV')
  async exportCharge(
    @Res() res: Response,
    @GetPrincipal() user: any,
  ): Promise<any> {
    return await this.chargeService.exportChargeCSV(res, user);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Post('create')
  async createCharge(
    @Body() newCharge: createChargerDto,
    @GetPrincipal() user: any,
  ) {
    return await this.chargeService.create(newCharge, user.company);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Get(':id')
  async getChargeById(
    @Param('id', ParseIntPipe) id: number,
    @GetPrincipal() user: any,
  ): Promise<Charge> {
    return await this.chargeService.getChargeById(id, user.company);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Get()
  async getChargeAllAdmin(@GetPrincipal() user: any): Promise<Charge[]> {
    return await this.chargeService.getChargeAllAdmin(user.company, user.roles);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Patch(':id')
  async updateCharge(
    @Param('id', ParseIntPipe) id: number,
    @Body() chargeModify: updateUserDto,
    @GetPrincipal() user: any,
  ) {
    return await this.chargeService.patchCharge(chargeModify, id, user.company);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Delete(':id')
  async deleteCharge(
    @Param('id', ParseIntPipe) id: number,
    @GetPrincipal() user: any,
  ) {
    return await this.chargeService.deleteCharge(id, user);
  }
  //SERVICIOS PARA INTERACTUAR CON LOS CARGADORES HIJOS
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Post('create/:id_company_son')
  async createChargeSon(
    @Body() newCharge: createChargerDto,
    @Param('id_company_son', ParseIntPipe) id_company_son: number,
    @GetPrincipal() user: any,
  ) {
    return await this.chargeService.createChargeSon(
      newCharge,
      user.company,
      id_company_son,
    );
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Get('charges_son/:id_charge_son')
  async getChargeByIdSon(
    @Param('id_charge_son', ParseIntPipe) id_charge_son: number,
    @GetPrincipal() user: any,
  ) {
    return await this.chargeService.getChargeByIdSon(
      user.company,
      id_charge_son,
    );
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Patch('chargeson/:id')
  async patchChargeSon(
    @Param('id', ParseIntPipe) id: number,
    @Body() chargeModify: updateUserDto,
    @GetPrincipal() user: any,
  ) {
    return await this.chargeService.patchChargeSon(
      chargeModify,
      id,
      user.company,
    );
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Charges')
  @Delete('chargeson/:id')
  async deleteChargeSon(
    @Param('id', ParseIntPipe) id: number,
    @GetPrincipal() user: any,
  ) {
    return await this.chargeService.deleteChargeSon(id, user.company);
  }

  // CARGADORES-TARJETA
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Card-Charges')
  @Post('new_card_charge')
  async newCard_Charge(@Body() newCard_Charge: createCard_ChargerDto) {
    return await this.chargeService.newCard_Charge(newCard_Charge);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @ApiTags('Card-Charges')
  @Post('changestate')
  async changeStateCard_Charge(@Body() newCard_Charge: createCard_ChargerDto) {
    return await this.chargeService.changeStateCard_Charge(newCard_Charge);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
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
