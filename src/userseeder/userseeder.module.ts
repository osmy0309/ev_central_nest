import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserSeederService } from './userseeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [UserSeederService, UserService],
})
export class UserseederModule {}
