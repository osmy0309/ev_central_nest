import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createUserDto, updateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Rol } from 'src/rol/entities/rol.entity';
import { Company } from 'src/client/entities/client.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Company) private clientRepository: Repository<Company>,
  ) {}

  async create(user: createUserDto, id_client: number): Promise<User> {
    const client = await this.clientRepository.findOne({
      where: {
        id: id_client,
      },
    });
    if (!client) {
      throw new HttpException('CLIENT_NOT_EXIST', 400);
    }

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
    user.client = client;
    await this.clientRepository.save(client);
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async getUser(user: any): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.username',
        'user.email',
        'user.direction',
        'user.dni',
        'user.roles',
        'company.id',
      ])
      .where('user.clientId = :id', { id: user.company })
      .getMany();
    if (users.length == 0) throw new HttpException('USER_NOT_FOUND', 400);
    return users;
  }

  async getUserByIdAuth(id: number): Promise<any> {
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

  async getUserById(id: number, usercompany: any): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.username',
        'user.email',
        'user.direction',
        'user.dni',
        'user.roles',
        'company.id',
      ])
      .where('user.clientId = :id', { id: usercompany })
      .andWhere('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new HttpException('USER_NOT_THIS_COMPANY', 400);
    }
    return user;
  }

  async getUserByUserName(username: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select(['user', 'company.id'])
      .where('user.username = :username', { username })
      .getOne();
    console.log(user);
    /*const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });*/
    if (!user) {
      return new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async deleteUser(id: number): Promise<any> {
    const user = await this.userRepository.delete({ id });
    if (user.affected === 0) {
      throw new HttpException('USER_NOT_FOUND', 400);
    }
    return user;
  }

  async updateUser(id: number, user: updateUserDto): Promise<any> {
    const response = await this.userRepository.update({ id }, user);
    if (response.affected === 0) {
      throw new HttpException('USER_NOT_FOUND', 400);
    }
    return response;
  }
}
