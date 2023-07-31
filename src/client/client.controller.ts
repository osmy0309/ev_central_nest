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
import { ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { createClientDto, updateClientDto } from './dto/client.dto';
import { Client } from './entities/client.entity';
@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Post()
  async createClient(@Body() newClient: createClientDto) {
    return await this.clientService.create(newClient);
  }

  @Get()
  async findAll() {
    return await this.clientService.getClients();
  }

  @Get(':id')
  async getUserByID(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return await this.clientService.getClientById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() clientModify: updateClientDto,
  ) {
    return await this.clientService.updateClient(id, clientModify);
  }

  @Delete(':id')
  async deleteUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    return await this.clientService.deleteClient(id);
  }
}
