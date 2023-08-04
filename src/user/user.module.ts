import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { Company } from 'src/client/entities/client.entity';
import { ClientService } from 'src/client/client.service';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol, Company])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
