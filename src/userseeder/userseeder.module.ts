import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/client/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserSeederService } from './userseeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  providers: [UserSeederService, UserService],
})
export class UserseederModule {}
