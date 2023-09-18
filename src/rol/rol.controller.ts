import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RolService } from './rol.service';
import { AuthGuard } from '../guards/auth.guard';
import { createRolDTO } from './dto/rol.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { ACGuard, UseRoles } from 'nest-access-control';
import { AppRecources } from './app.roles';
import { Roles } from './decorator/rol.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  /*  @Roles('ADMIN', 'ROLE_USER')
  @Auth()
  @Get()
  async findAll() {
    return await this.rolService.getAll();
  }

  @Auth()
  @ApiBearerAuth()
  @Post()
  async create(@Body() createRolDTO: createRolDTO) {
    return await this.rolService.create(createRolDTO);
  }*/
}
