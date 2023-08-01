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

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Get()
  async findAll(@GetPrincipal() user: any) {
    return await this.userService.getUser();
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Auth()
  @Get(':id')
  async getUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getUserById(id);
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
