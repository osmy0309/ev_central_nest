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
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto, userUpdateDto } from './dto/create-user.dto';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from './entities/user.entity';
import { Res } from '@nestjs/common/decorators/http';
import { Response } from 'express';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //SERVICIO PARA ADICIONAR USUARIOS A LA COMPAÑIA DEL USUARIO LOGUEADO
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post()
  async createUser(@Body() newUser: createUserDto, @GetPrincipal() user: any) {
    return await this.userService.create(newUser, user.company);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post(':id_client_son')
  async createClientSon(
    @Param('id_client_son', ParseIntPipe) id_client_son: number,
    @Body() newUser: createUserDto,
    @GetPrincipal() user: any,
  ) {
    return await this.userService.createClientSon(
      newUser,
      user.company,
      id_client_son,
    );
  }

  //SERVICIO QUE BRINDA TODOS LOS USUARIOS QUE PERTENECEN A LA EMPRESA QUE EL USUARIO ESTA LOGIN SIN MOSTRAR LOS DE LAS EMPRESAS HIJAS
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get()
  async myUser(@GetPrincipal() user: any) {
    return await this.userService.getUser(user);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('exportCSV')
  async exportUser(
    @Res() res: Response,
    @GetPrincipal() user: any,
  ): Promise<void> {
    return await this.userService.exportUserCSV(res, user);
  }

  /*@Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('exportChargeCSV')
  async exportCharge(
    @Res() res: Response,
    @GetPrincipal() user: any,
  ): Promise<void> {
    return await this.userService.exportChargeCSV(res, user);
  }*/
  //SERVICIO PARA OBTENER USUARIO CON SU ID Y QUE PERTENEZCA A LA COMPAÑIA
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get(':id')
  async getUserByID(
    @Param('id', ParseIntPipe) id: number,
    @GetPrincipal() user: any,
  ): Promise<any> {
    return await this.userService.getUserById(id, user);
  }
  //SERVICIO PARA Modificar USUARIO CON SU ID Y QUE PERTENEZCA A LA COMPAÑIA
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Patch(':my_users_id')
  async updateUser(
    @Param('my_users_id', ParseIntPipe) my_users_id: number,
    @Body() userModify: userUpdateDto,
    @GetPrincipal() user: any,
  ) {
    return await this.userService.updateUser(my_users_id, userModify, user);
  }
  //SERVICIO PARA ELIMINAR USUARIO CON SU ID Y QUE PERTENEZCA A LA COMPAÑIA
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Delete(':my_user_id')
  async deleteUsers(
    @Param('my_user_id', ParseIntPipe) my_user_id: number,
    @GetPrincipal() user: any,
  ): Promise<any> {
    return await this.userService.deleteUser(my_user_id, user);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Delete('user_son/:user_id')
  async deleteUserOtherCompanySon(
    @Param('user_id', ParseIntPipe) user_id: number,
    @GetPrincipal() user: any,
  ): Promise<any> {
    if (isNaN(user_id)) {
      throw new BadRequestException('Los parámetros deben ser números enteros');
    }
    return await this.userService.deleteUserOtherCompanySon(
      user_id,
      user.company,
    );
  }
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Patch('user_son/:user_id')
  async updateUserOtherCompanySon(
    @Param('user_id', ParseIntPipe) user_id: number,
    @GetPrincipal() user: any,
    @Body() userModify: userUpdateDto,
  ): Promise<User> {
    if (isNaN(user_id)) {
      throw new BadRequestException('Los parámetros deben ser números enteros');
    }
    return await this.userService.updateUserOtherCompanySon(
      user_id,
      userModify,
      user.company,
    );
  }
}
