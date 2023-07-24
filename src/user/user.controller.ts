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
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({
    type: createUserDto,
    required: true,
    description:
      'Los datos del usuario a crear (username: string, password: string, firstName: string, lastName: string, email: string, direction: string, dni: string)',
  })
  @ApiParam({ name: 'newUser', type: createUserDto, required: true })
  async createUser(@Body() newUser: createUserDto) {
    return await this.userService.create(newUser);
  }

  @Get()
  async findAll(@GetPrincipal() user: any) {
    return await this.userService.getUser();
  }

  @Get(':id')
  async getUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  @ApiBody({
    type: updateUserDto,
    required: true,
    description:
      'Los datos del usuario a modificar (username: string, password: string, firstName: string, lastName: string, email: string, direction: string, dni: string)',
  })
  @ApiParam({ name: 'newUser', type: updateUserDto, required: true })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userModify: any,
  ) {
    return await this.userService.updateUser(id, userModify);
  }

  @Delete(':id')
  async deleteUsers(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.userService.deleteUser(id);
  }
}
