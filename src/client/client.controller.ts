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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { ClientService } from './client.service';
import { createClientDto, updateClientDto } from './dto/client.dto';
import { Company } from './entities/client.entity';
@ApiTags('Company')
@Controller('company')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Post()
  async createClient(@Body() newClient: createClientDto): Promise<Company> {
    return await this.clientService.create(newClient);
  }

  @Get()
  async findAll(): Promise<Company[]> {
    return await this.clientService.getClients();
  }

  @Get(':id')
  async getUserByID(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return await this.clientService.getClientById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() clientModify: updateClientDto,
  ): Promise<Company> {
    return await this.clientService.updateClient(id, clientModify);
  }

  @Delete(':id')
  async deleteUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    return await this.clientService.deleteClient(id);
  }
}
