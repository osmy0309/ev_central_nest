import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { createClientDto, updateClientDto } from './dto/client.dto';
import { Company } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Company) private clientRepository: Repository<Company>,
    private dataSource: DataSource,
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

  async getMyClients(id_company): Promise<Company[]> {
    const clients = await this.dataSource
      .createQueryBuilder()
      .select('company')
      .from(Company, 'company')
      .where('id_pather = :id', { id: id_company })
      .getMany();

    if (clients.length == 0)
      throw new HttpException('CLIENT_NOT_FOUND_THIS_COMPANY', 400);
    return clients;
  }

  async getMyClientsTree(id_company): Promise<any> {
    async function getMyClientsTreeA(
      id_company: number,
      dataSource: any,
    ): Promise<any> {
      const companies = await dataSource
        .createQueryBuilder()
        .select('company')
        .from(Company, 'company')
        .where('id_pather = :id', { id: id_company })
        .getMany();

      for (const company of companies) {
        const children = await getMyClientsTreeA(company.id, dataSource);
        if (children.length) {
          company.company_son = children;
        }
      }

      return companies;
    }

    const response = await getMyClientsTreeA(id_company, this.dataSource);
    if (response.length == 0) {
      throw new HttpException('CLIENT_NOT_FOUND_THIS_COMPANY', 400);
    }

    return response;
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

  async deleteClient(
    id: number,
    id_company: number,
  ): Promise<{ success: boolean }> {
    if (id != id_company) {
      const treeClient = await this.getMyClientsTree(id_company);
      async function idExistsInTree(
        data: any[],
        idToFind: number,
      ): Promise<boolean> {
        for (const item of data) {
          if (item.id === idToFind) {
            return true;
          }
          if (item.company_son) {
            const idExistsInChildren = await idExistsInTree(
              item.company_son,
              idToFind,
            );
            if (idExistsInChildren) {
              return true;
            }
          }
        }
        return false;
      }

      const found = await idExistsInTree(treeClient, id);

      if (!found) throw new HttpException('CLIENT_NOT_EXIST', 400);
    }

    async function deleteTree(data: any[], clientRepository) {
      data.forEach(async (company) => {
        if (company.company_son) {
          await deleteTree(company.company_son, clientRepository);
        }
        await clientRepository.delete({ id: company.id });
      });

      const clientsDelete = await this.getMyClientsTree(id);
      await deleteTree(clientsDelete, this.clientRepository);
    }

    const client = await this.clientRepository.delete({ id });
    if (client.affected === 0) {
      throw new HttpException('CLIENT_NOT_FOUND', 400);
    }
    return { success: true };
  }

  async updateClient(
    id: number,
    client: updateClientDto,
    id_company: number,
  ): Promise<Company> {
    if (id != id_company) {
      const treeClient = await this.getMyClientsTree(id_company);
      async function idExistsInTree(
        data: any[],
        idToFind: number,
      ): Promise<boolean> {
        for (const item of data) {
          if (item.id === idToFind) {
            return true;
          }
          if (item.company_son) {
            const idExistsInChildren = await idExistsInTree(
              item.company_son,
              idToFind,
            );
            if (idExistsInChildren) {
              return true;
            }
          }
        }
        return false;
      }

      const found = await idExistsInTree(treeClient, id);

      if (!found) throw new HttpException('CLIENT_NOT_EXIST', 400);
    }

    const response = await this.clientRepository.update({ id }, client);
    if (response.affected === 0) {
      throw new HttpException('CLIENT_NOT_FOUND', 400);
    }
    const client_response = await this.getClientById(id);
    return client_response;
  }
}
