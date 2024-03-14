import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Brackets } from 'typeorm';
import { createClientDto, updateClientDto } from './dto/client.dto';
import { Company } from './entities/client.entity';
import { Response } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Company) private clientRepository: Repository<Company>,
    private dataSource: DataSource,
  ) {}

  async create(client: createClientDto, id_company: number): Promise<Company> {
    const clientFind = await this.clientRepository.findOne({
      where: [
        { nif: client.nif },
        { email: client.email },
        { isActive: true },
        // Aquí puedes agregar cualquier otra condición necesaria
      ],
    });
    if (clientFind) {
      if (clientFind.email == client.email)
        throw new HttpException('EMAIL_EXIST', 403);
      if (clientFind.nif == client.nif)
        throw new HttpException('NIF_EXIST', 403);
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
      where: [
        { nif: client.nif },
        { email: client.email },
        // Aquí puedes agregar cualquier otra condición necesaria
      ],
    });
    if (clientFind) {
      if (clientFind.email == client.email && client.isActive)
        throw new HttpException('EMAIL_EXIST', 403);
      if (clientFind.nif == client.nif && client.isActive)
        throw new HttpException('NIF_EXIST', 403);
    }
    //console.log(id_client_search);

    do {
      const response = await this.getClientById(id_client_search);
      //console.log(id_company, 'idcompany');
      //console.log(response);
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

    if (!flag) return {} as Company;
    client.id_pather = id_client_other;
    const newClient = this.clientRepository.create(client);
    return await this.clientRepository.save(newClient);
  }

  async getMyClients(id_company: number): Promise<Company[]> {
    const clients = await this.dataSource
      .createQueryBuilder()
      .select('company')
      .from(Company, 'company')
      .where('id_pather = :id', { id: id_company })
      .andWhere('company.isActive = :flag', { flag: true })
      .getMany();

    if (clients.length == 0) return {} as Company[];
    return clients;
  }

  async getMyClientsTree(id_company: number, rol): Promise<any> {
    async function getMyClientsTreeA(
      id_company: number,
      dataSource: any,
    ): Promise<any[]> {
      const companies = await dataSource
        .createQueryBuilder()
        .select('company')
        .from(Company, 'company')
        .where('id_pather = :id', { id: id_company })
        .andWhere('company.isActive = :flag', { flag: true })
        .getMany();

      const result: any[] = [];

      for (const company of companies) {
        const children = await getMyClientsTreeA(company.id, dataSource);
        result.push(company, ...children);
      }

      return result;
    }

    const response = await getMyClientsTreeA(id_company, this.dataSource);

    if (response.length === 0) {
      return [];
    }

    return response;
  }

  async getClientById(id: number): Promise<Company> {
    const client = await this.dataSource
      .createQueryBuilder()
      .select('company')
      .from(Company, 'company')
      .where('id = :id', { id })
      .andWhere('company.isActive = :flag', { flag: true })
      .getOne();
    if (!client) {
      return {} as Company;
    }
    return client;
  }

  async getClientByEmail(email: string): Promise<Company> {
    /* const client = await this.clientRepository.findOne({
      where: {
        email,
      },
    });*/

    const client = await this.dataSource
      .createQueryBuilder()
      .select('company')
      .from(Company, 'company')
      .where('email = :email', { email })
      .andWhere('company.isActive = :flag', { flag: true })
      .getOne();

    if (!client) {
      return {} as Company;
    }
    return client;
  }

  async deleteClient(
    id: number,
    id_company: number,
    rol,
  ): Promise<{ success: boolean }> {
    if (id != id_company) {
      const treeClient = await this.getMyClientsTree(id_company, rol);
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

      if (!found) return { success: false };
    }

    async function deleteTree(data: any[], clientRepository) {
      data.forEach(async (company) => {
        if (company.company_son) {
          await deleteTree(company.company_son, clientRepository);
        }
        //await clientRepository.delete({ id: company.id });
        await this.clientRepository
          .createQueryBuilder()
          .update(Company)
          .set({ isActive: false })
          .where('id = :id', { id })
          .execute();
      });

      const clientsDelete = await this.getMyClientsTree(id);
      await deleteTree(clientsDelete, this.clientRepository);
    }

    // const client = await this.clientRepository.delete({ id });
    await this.clientRepository
      .createQueryBuilder()
      .update(Company)
      .set({ isActive: false })
      .where('id = :id', { id })
      .execute();
    /* if (client.affected === 0) {
      return { success: false };
    }*/
    return { success: true };
  }

  async clientIsMy(id_cliente: number, id_son: number, rol): Promise<boolean> {
    const treeClient = await this.getMyClientsTree(id_cliente, rol);
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

    return await idExistsInTree(treeClient, id_son);
  }

  async updateClient(
    id: number,
    client: updateClientDto,
    id_company: number,
    rol,
  ): Promise<Company> {
    const clientFind = await this.clientRepository
      .createQueryBuilder('client')
      .select(['client'])
      .andWhere('user.id != :id', { id: id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('client.email = :email', { email: client.email }).orWhere(
            'user.nif = :nif',
            { nif: client.nif },
          );
        }),
      )
      .getOne();

    await this.clientRepository.findOne({
      where: [
        { nif: client.nif || '' },
        { email: client.email || '' },
        // Aquí puedes agregar cualquier otra condición necesaria
      ],
    });
    if (clientFind) {
      if (clientFind.email == client.email && clientFind.isActive)
        throw new HttpException('EMAIL_EXIST', 403);
      if (clientFind.nif == client.nif && clientFind.isActive)
        throw new HttpException('NIF_EXIST', 403);
    }
    if (id != id_company) {
      const treeClient = await this.getMyClientsTree(id_company, rol);
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

      if (!found) return {} as Company;
    }

    const response = await this.clientRepository.update({ id }, client);
    if (response.affected === 0) {
      return {} as Company;
    }
    const client_response = await this.getClientById(id);
    return client_response;
  }

  async deleteClientSon(
    id: number,
    id_company: number,
    rol,
  ): Promise<{ success: boolean }> {
    //console.log('here');
    if (id != id_company) {
      const treeClient = await this.getMyClientsTree(id_company, rol);
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

      if (!found) return { success: false };
    }

    async function deleteTree(data: any[], clientRepository) {
      data.forEach(async (company) => {
        if (company.company_son) {
          await deleteTree(company.company_son, clientRepository);
        }
        //await clientRepository.delete({ id: company.id });

        await this.clientRepository
          .createQueryBuilder()
          .update(Company)
          .set({ isActive: false })
          .where('id = :id', { id })
          .execute();
      });

      const clientsDelete = await this.getMyClientsTree(id);
      await deleteTree(clientsDelete, this.clientRepository);
    }

    //const client = await this.clientRepository.delete({ id });
    await this.clientRepository
      .createQueryBuilder()
      .update(Company)
      .set({ isActive: false })
      .where('id = :id', { id })
      .execute();
    /*if (client.affected === 0) {
      return { success: false };
    }*/
    return { success: true };
  }
}
