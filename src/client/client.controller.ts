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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlobOptions } from 'buffer';
import { Auth } from 'src/decorators/auth.decorator';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { ClientService } from './client.service';
import { createClientDto, updateClientDto } from './dto/client.dto';
import { Company } from './entities/client.entity';
import { Res } from '@nestjs/common/decorators/http';
import { Response } from 'express';
@ApiTags('Company')
@Controller('company')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post()
  async createClient(
    @GetPrincipal() user: any,
    @Body() newClient: createClientDto,
  ): Promise<Company> {
    return await this.clientService.create(newClient, user.company);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post(':id_client_other')
  async createClientByOtherClient(
    @Param('id_client_other', ParseIntPipe) id_client_other: number,
    @GetPrincipal() user: any,
    @Body() newClient: createClientDto,
  ): Promise<Company> {
    return await this.clientService.createClientByOtherClient(
      newClient,
      user.company,
      id_client_other,
    );
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('companys_son_tree')
  async findAllMyClients(@GetPrincipal() user: any): Promise<Company[]> {
    return await this.clientService.getMyClientsTree(user.company, user.roles);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('company_login')
  async getClientById(@GetPrincipal() user: any): Promise<Company> {
    return await this.clientService.getClientById(user.company);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Patch(':id')
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() clientModify: updateClientDto,
    @GetPrincipal() user: any,
  ): Promise<Company> {
    return await this.clientService.updateClient(
      id,
      clientModify,
      user.company,
      user.roles,
    );
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Delete(':id')
  async deleteClient(
    @Param('id', ParseIntPipe) id: number,
    @GetPrincipal() user: any,
  ): Promise<{ success: boolean }> {
    return await this.clientService.deleteClient(id, user.company, user.roles);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Delete('delete/:id_company_son')
  async clientDeleteEvery(
    @Param('id_company_son', ParseIntPipe) id_company_son: number,
    @GetPrincipal() user: any,
  ): Promise<any> {
    return await this.clientService.deleteClientSon(
      id_company_son,
      user.company,
      user.roles,
    );
  }
}
