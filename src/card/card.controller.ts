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

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @UseGuards(AuthGuard)
  @Post('create')
  async createCard(
    @Body() newCard: any,
    id_user: number,
    @GetPrincipal() user: any,
  ) {
    return await this.cardService.create(newCard, user.userid);
  }
}
