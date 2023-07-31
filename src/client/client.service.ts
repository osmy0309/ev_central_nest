import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createClientDto, updateClientDto } from './dto/client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async create(client: createClientDto): Promise<Client> {
    const clientFind = await this.clientRepository.findOne({
      //BUSCAR PARA QUE NO EXISTAN USUARIOS REPETIDOS
      where: {
        email: client.email,
      },
    });
    if (clientFind) {
      throw new HttpException('CLIENT_EXIST', 400);
    }

    const newClient = this.clientRepository.create(client);
    return await this.clientRepository.save(newClient);
  }

  async getClients(): Promise<Client[]> {
    const clients = await this.clientRepository.find();
    if (!clients.length) throw new HttpException('CLIENT_NOT_FOUND', 400);
    return clients;
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: {
        id,
      },
    });
    if (!client) {
      throw new HttpException('CLIENT_NOT_FOUND', 400);
    }
    return client;
  }

  async getClientByEmail(email: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: {
        email,
      },
    });
    if (!client) {
      throw new HttpException('USER_NOT_FOUND', 400);
    }
    return client;
  }

  async deleteClient(id: number): Promise<{ success: boolean }> {
    const response = await this.getClientById(id);
    const client = await this.clientRepository.delete({ id });
    if (client.affected === 0) {
      throw new HttpException('CLIENT_NOT_FOUND', 400);
    }
    return { success: true };
  }

  async updateClient(id: number, client: updateClientDto): Promise<Client> {
    const response = await this.clientRepository.update({ id }, client);
    if (response.affected === 0) {
      throw new HttpException('CLIENT_NOT_FOUND', 400);
    }
    const client_response = await this.getClientById(id);
    return client_response;
  }
}
