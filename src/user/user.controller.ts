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
import { UserService } from './user.service';
import { createUserDto, updateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { Auth } from 'src/decorators/auth.decorator';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //SERVICIO PARA ADICIONAR USUARIOS A UNA COMPAÑIA DETERMINADA
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Post(':id_client')
  async createUser(
    @Param('id_company', ParseIntPipe) id_client: number,
    @Body() newUser: createUserDto,
  ) {
    return await this.userService.create(newUser, id_client);
  }

  //SERVICIO QUE BRINDA TODOS LOS USUARIOS QUE PERTENECEN A LA EMPRESA QUE EL USUARIO ESTA LOGIN SIN MOSTRAR LOS DE LAS EMPRESAS HIJAS
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('my_user')
  async findAll(@GetPrincipal() user: any) {
    return await this.userService.getUser(user);
  }
  //SERVICIO PARA OBTENER USUARIO CON SU ID Y QUE PERTENEZCA A LA COMPAÑIA
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Get(':id')
  async getUserByID(
    @Param('id', ParseIntPipe) id: number,
    @GetPrincipal() user: any,
  ): Promise<any> {
    return await this.userService.getUserById(id, user.company);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userModify: any,
  ) {
    return await this.userService.updateUser(id, userModify);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Delete(':id')
  async deleteUsers(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.userService.deleteUser(id);
  }
}
