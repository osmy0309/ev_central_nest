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
import { CardService } from './card.service';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createCardDto, updateCardDto, asingCardDto } from './dto/card.dto';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { Auth } from 'src/decorators/auth.decorator';

@ApiTags('Cards')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Post()
  async createCard(@Body() newCard: createCardDto) {
    return await this.cardService.create(newCard);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Post('asing_to_card')
  async asingCard(@Body() asing: asingCardDto) {
    return await this.cardService.asingCard(asing);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('by_user_autentication')
  async getCardsByUserAutentication(@GetPrincipal() user: any) {
    return await this.cardService.getCardsByUserAutentication(user.userid);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Get('by_admin')
  async findAll() {
    return await this.cardService.getAllCards();
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() cardModify: updateCardDto,
    @GetPrincipal() user: any,
  ) {
    console.log(user);
    return await this.cardService.patchCards(cardModify, id, user.userid);
  }

  @Roles('ADMIN')
  @Auth()
  @Delete(':id')
  async deleteUsers(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.cardService.deleteCard(id);
  }
}
