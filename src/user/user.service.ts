import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createUserDto, updateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Rol } from 'src/rol/entities/rol.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Rol) private rolRepository: Repository<Rol>,
  ) {}

  async create(user: createUserDto): Promise<User> {
    const userFind = await this.userRepository.findOne({
      //BUSCAR PARA QUE NO EXISTAN USUARIOS REPETIDOS
      where: {
        username: user.username,
      },
    });
    if (userFind) {
      throw new HttpException('USER_EXIST', HttpStatus.CONFLICT);
    }

    user.password = await hash(user.password, 10);

    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async getUser(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users.length) throw new HttpException('USER_NOT_FOUND', 400);
    return users;
  }

  async getUserById(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return new HttpException('USER_NOT_FOUND', 400);
    }
    return user;
  }

  async getUserByUserName(username: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      return new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async deleteUser(id: number): Promise<any> {
    const user = await this.userRepository.delete({ id });
    if (user.affected === 0) {
      return new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(id: number, user: updateUserDto): Promise<any> {
    const response = await this.userRepository.update({ id }, user);
    if (response.affected === 0) {
      return new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return response;
  }
}
