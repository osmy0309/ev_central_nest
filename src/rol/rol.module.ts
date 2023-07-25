import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Rol } from './entities/rol.entity';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';

@Module({
  controllers: [RolController],
  providers: [RolService],
  imports: [TypeOrmModule.forFeature([Rol])],
  exports: [TypeOrmModule.forFeature([Rol])],
})
export class RolModule {}
