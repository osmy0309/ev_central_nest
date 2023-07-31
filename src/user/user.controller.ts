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

  @Post(':id_client')
  async createUser(
    @Param('id_client', ParseIntPipe) id_client: number,
    @Body() newUser: createUserDto,
  ) {
    return await this.userService.create(newUser, id_client);
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
