import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createRolDTO } from './dto/rol.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolService {
  constructor(@InjectRepository(Rol) private rolRepository: Repository<Rol>) {}

  async getAll(): Promise<any> {
    const roles = await this.rolRepository.find();
    if (!roles.length) return new HttpException('ROLES_NOT_FOUND', 400);

    return roles;
  }
  async create(createRolDTO: createRolDTO): Promise<any> {
    const rol = await this.rolRepository.findOne({
      where: { rolname: createRolDTO.rolname },
    });
    if (rol) return new HttpException('ROL_EXIST', 400);
    await this.rolRepository.save(createRolDTO as Rol);
    return { status: 'Rol created' };
  }
}
