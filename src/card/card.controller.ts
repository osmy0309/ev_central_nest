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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUsers(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.cardService.deleteCard(id);
  }
}
