import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { CardService } from './card.service';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createCardDto, updateCardDto, asingCardDto } from './dto/card.dto';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { userLoginDto } from 'src/gralDTO/userLogin.dto';
import { Response } from 'express';

@ApiTags('Cards')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Roles('ADMIN', 'ROLE_USER')
  @ApiBearerAuth()
  @Auth()
  @Post()
  async createCard(
    @Body() newCard: createCardDto,
    @GetPrincipal() user: userLoginDto,
  ) {
    return await this.cardService.create(newCard, user);
  }

  @Roles('ADMIN', 'ROLE_USER')
  @ApiBearerAuth()
  @Auth()
  @Post('asing_to_card')
  async asingCard(@Body() asing: asingCardDto) {
    return await this.cardService.asingCard(asing);
  }

  @Roles('ADMIN', 'ROLE_USER')
  @ApiBearerAuth()
  @Auth()
  @Get('exportCSV')
  async exportCard(
    @Res() res: Response,
    @GetPrincipal() user: any,
  ): Promise<any> {
    return await this.cardService.exportCardCSV(res, user);
  }

  @Roles('ADMIN', 'ROLE_USER')
  @ApiBearerAuth()
  @Auth()
  @Get('by_user_autentication')
  async getCardsByUserAutentication(@GetPrincipal() user: any) {
    return await this.cardService.getCardsByUserAutentication(user.userid);
  }

  @Roles('ADMIN', 'ROLE_USER')
  @ApiBearerAuth()
  @Auth()
  @Get()
  async findAll(@GetPrincipal() user: userLoginDto) {
    return await this.cardService.getAllCards(user);
  }

  @Roles('ADMIN', 'ROLE_USER')
  @ApiBearerAuth()
  @Auth()
  @Patch(':id')
  async updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body() cardModify: updateCardDto,
    @GetPrincipal() user: userLoginDto,
  ) {
    return await this.cardService.patchCards(
      cardModify,
      id,
      user.userid,
      false,
    );
  }

  @Roles('ADMIN', 'ROLE_USER')
  @Auth()
  @Delete(':id')
  async deleteUsers(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.cardService.deleteCard(id);
  }
}
