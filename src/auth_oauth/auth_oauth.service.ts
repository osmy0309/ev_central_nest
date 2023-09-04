import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/client/entities/client.entity';
import { createUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthOauthService {
  constructor() {}
  @Optional()
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @Optional()
  @InjectRepository(Company)
  private readonly companyRepository: Repository<Company>;
  async validateUser(details: createUserDto) {
    console.log('validateUser');
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.dni',
        'user.username',
        'user.roles',
        'company',
      ])
      .where('user.email = :email', { email: details.email })
      .getOne();
    if (user) return user;
    details.roles = ['AUTOR'];
    console.log('User not found. CREATE...');
    const company = await this.companyRepository.findOneBy({ id: 1 });
    details.client = company;
    const newUser = this.userRepository.create(details);
    await this.userRepository.save(newUser);
    const userfind = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.dni',
        'user.username',
        'user.roles',
        'company',
      ])
      .where('user.email = :email', { email: details.email })
      .getOne();
    return userfind;
  }

  async findUser(id: number) {
    console.log('findUser');

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select(['user', 'company'])
      .where('user.id = :id', { id })
      .getOne();
    return user;
  }
}
