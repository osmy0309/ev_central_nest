import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createClientDto, updateClientDto } from './dto/client.dto';
import { Company } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Company) private clientRepository: Repository<Company>,
  ) {}

  async create(client: createClientDto, id_company: number): Promise<Company> {
    const clientFind = await this.clientRepository.findOne({
      //BUSCAR PARA QUE NO EXISTAN USUARIOS REPETIDOS
      where: {
        email: client.email,
      },
    });
    if (clientFind) {
      throw new HttpException('CLIENT_EXIST', 400);
    }
    client.id_pather = id_company;
    const newClient = this.clientRepository.create(client);
    return await this.clientRepository.save(newClient);
  }

  async createClientByOtherClient(
    client: createClientDto,
    id_company: number,
    id_client_other: number,
  ): Promise<Company> {
    let id_client_search = id_client_other;
    let flag = false;
    const clientFind = await this.clientRepository.findOne({
      where: {
        email: client.email,
      },
    });
    if (clientFind) {
      throw new HttpException('CLIENT_EXIST', 400);
    }
    console.log(id_client_search);

    do {
      const response = await this.getClientById(id_client_search);
      console.log(id_company, 'idcompany');
      console.log(response);
      id_client_search = response.id_pather;
      if (response.id_pather == id_company) {
        flag = true;
        break;
      } else if (
        id_client_search == id_company &&
        response.id_pather == id_company
      ) {
        flag = true;
        break;
      }
    } while (id_client_search != id_company && id_client_search != 0);

    if (!flag) throw new HttpException('COMPANY_NOT_IS_SON', 400);
    client.id_pather = id_client_other;
    const newClient = this.clientRepository.create(client);
    return await this.clientRepository.save(newClient);
  }

  async getClients(): Promise<Company[]> {
    const clients = await this.clientRepository.find();
    if (!clients.length) throw new HttpException('CLIENT_NOT_FOUND', 400);
    return clients;
  }

  async getClientById(id: number): Promise<Company> {
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

  async getClientByEmail(email: string): Promise<Company> {
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

  async updateClient(id: number, client: updateClientDto): Promise<Company> {
    const response = await this.clientRepository.update({ id }, client);
    if (response.affected === 0) {
      throw new HttpException('CLIENT_NOT_FOUND', 400);
    }
    const client_response = await this.getClientById(id);
    return client_response;
  }
}
