import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { Company } from 'src/client/entities/client.entity';
import { createClientDto } from 'src/client/dto/client.dto';

@Injectable()
export class UserSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Company) private clientRepository: Repository<Company>,
  ) {}

  async onModuleInit() {
    const clients = await this.clientRepository.find();
    if (clients.length === 0) {
      const nuevoClient = new createClientDto();
      (nuevoClient.business_name = 'Provicional'),
        (nuevoClient.direction = 'Provicional'),
        (nuevoClient.email = 'prueba@gmail.com'),
        (nuevoClient.id_pather = 0),
        (nuevoClient.nif = 'provicional'),
        (nuevoClient.phone = 'provicional');
      const newClient = this.clientRepository.create(nuevoClient);
      const cliente_response = await this.clientRepository.save(newClient);

      const usuarios = await this.userRepository.find();
      if (usuarios.length === 0) {
        const nuevoUsuario = new createUserDto();
        nuevoUsuario.username = 'admin';
        nuevoUsuario.password = await hash('admin123', 10);
        nuevoUsuario.direction = 'as';
        nuevoUsuario.dni = '84';
        nuevoUsuario.roles = ['ADMIN'];
        nuevoUsuario.email = 'ADMIN@dni.com';
        nuevoUsuario.firstName = 'ADMIN@dni.com';
        nuevoUsuario.lastName = 'ADMIN@dni.com';
        nuevoUsuario.client = cliente_response;

        const newUser = this.userRepository.create(nuevoUsuario);
        await this.userRepository.save(newUser);
      }
    }
  }
}
