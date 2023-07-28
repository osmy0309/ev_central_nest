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
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createCardDto, updateCardDto } from './dto/card.dto';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { Auth } from 'src/decorators/auth.decorator';

@ApiTags('Cards')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create')
  async createCard(
    @Body() newCard: createCardDto,
    id_user: number,
    @GetPrincipal() user: any,
  ) {
    return await this.cardService.create(newCard, user.userid);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Get()
  async findAll(@GetPrincipal() user: any) {
    return await this.cardService.getCards(user.userid);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() cardModify: updateCardDto,
    @GetPrincipal() user: any,
  ) {
    console.log(user);
    return await this.cardService.patchCards(cardModify, id, user.userid);
  }

  @Roles('ADMIN', 'AUTOR')
  @Auth()
  @Delete(':id')
  async deleteUsers(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.cardService.deleteCard(id);
  }
}
