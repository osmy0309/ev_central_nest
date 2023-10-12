import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createUserDto, userUpdateDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Company } from 'src/client/entities/client.entity';
import { ClientService } from 'src/client/client.service';
import { ChargeService } from 'src/charge/charge.service';
import { Response } from 'express';
import { createObjectCsvWriter, createObjectCsvStringifier } from 'csv-writer';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Company) private clientRepository: Repository<Company>,
    // @InjectRepository(Charge) private chargeRepository: Repository<Charge>,
    /*@InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,*/

    private chargeService: ChargeService,
    private clientService: ClientService,
    private dataSource: DataSource,
  ) {}

  async create(user: createUserDto, id_client: number): Promise<User> {
    const client = await this.clientRepository.findOne({
      where: {
        id: id_client,
      },
    });
    if (!client) {
      throw new HttpException('CLIENT_NOT_EXIST', 400);
    }

    const userFind = await this.userRepository.findOne({
      //BUSCAR PARA QUE NO EXISTAN USUARIOS REPETIDOS
      where: {
        username: user.username,
      },
    });
    if (userFind) {
      throw new HttpException('USER_EXIST', HttpStatus.CONFLICT);
    }
    if (!user.roles || user.roles.length == 0) {
      user.roles.push('AUTOR');
    }
    user.password = await hash(user.password, 10);
    user.client = client;
    await this.clientRepository.save(client);
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  //DEVUELVE TODOS LOS USUARIOS BASES DE LA COMPAñIA DEL USUARIO LOGUEADO
  async getUser(user: any): Promise<User[]> {
    let arrayallcompany = [];
    let myCompany = [];
    let allUsers = [];
    const charges = await this.chargeService.getChargeAllAdmin(
      user.company,
      user.roles,
    );
    const companies_son = await this.clientService.getMyClientsTree(
      user.company,
      user.roles,
    );
    function addCompanies(companies) {
      for (const company of companies) {
        arrayallcompany.push({ ...company }); // Add the company as a charger

        if (company.company_son) {
          // Check if it has child companies
          addCompanies(company.company_son); // Recursively add the child companies
        }
      }
    }

    if (!companies_son.status) myCompany = companies_son; //----En caso de que no tenga comañias hijas
    myCompany.push({ id: user.company, name: 'My Company' } as Company);
    addCompanies(myCompany);
    for (const company of arrayallcompany) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.client', 'company')
        .leftJoinAndSelect('user.cards', 'card')
        .leftJoinAndSelect('card.transaction', 'transaction')
        .leftJoinAndSelect('transaction.timezones', 'timezones')
        //   .leftJoinAndSelect('transaction.charge', 'charge_information')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.isActive',
          'user.username',
          'user.email',
          'user.direction',
          'user.dni',
          'user.roles',
          'company.id',
          'card',
          'transaction',
          'timezones',
          //   'charge_information',
        ])
        .where('user.clientId = :id', { id: company.id })
        .getMany();
      if (users.length == 0) continue;
      for (const user of users) {
        allUsers.push(user);
        for (const char of charges) {
          if (char.transaction.length > 0) {
            for (const transaction of char.transaction) {
              if (user?.id == transaction.card?.user?.id) {
                allUsers[allUsers.length - 1].charge_information = [char];
              }
            }
          }
        }
      }
    }

    //if (allUsers.length == 0) throw new HttpException('USER_NOT_FOUND', 400);
    return allUsers;
  }
  //DEVULEVE SOLO LOS DATOS DEL USUARIO LOGUEADO
  async getUserByIdAuth(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return new HttpException('USER_NOT_FOUND', 400);
    }
    return user;
  }

  async getUserById(id: number, usercompany: any): Promise<User> {
    let arrayallcompany = [];
    let myCompany = [];

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'client')
      //   .leftJoinAndSelect('transaction.charge', 'charge_information')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.username',
        'user.email',
        'user.direction',
        'user.dni',
        'user.roles',
        'user.client',
        'client.id',
        //   'charge_information',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) return {} as User;
    const charges = await this.chargeService.getChargeAllAdmin(
      usercompany.company,
      usercompany.roles,
    );
    const companies_son = await this.clientService.getMyClientsTree(
      usercompany.company,
      usercompany.roles,
    );
    function addCompanies(companies) {
      for (const company of companies) {
        arrayallcompany.push({ ...company }); // Add the company as a charger

        if (company.company_son) {
          // Check if it has child companies
          addCompanies(company.company_son); // Recursively add the child companies
        }
      }
    }

    if (!companies_son.status) myCompany = companies_son; //----En caso de que no tenga comañias hijas
    myCompany.push({ id: usercompany.company, name: 'My Company' } as Company);
    addCompanies(myCompany);
    for (const companyarray of arrayallcompany) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.client', 'company')
        .leftJoinAndSelect('user.cards', 'card')
        .leftJoinAndSelect('card.transaction', 'transaction')
        .leftJoinAndSelect('transaction.timezones', 'timezones')
        //   .leftJoinAndSelect('transaction.charge', 'charge_information')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.isActive',
          'user.username',
          'user.email',
          'user.direction',
          'user.dni',
          'user.roles',
          'company.id',
          'card',
          'transaction',
          'timezones',
          //   'charge_information',
        ])
        .where('user.clientId = :idbus', { idbus: companyarray.id })
        .andWhere('user.id = :id', { id })
        .getOne();
      if (!users) continue;
      else {
        let response: any = users;
        for (const char of charges) {
          if (char.transaction.length > 0) {
            for (const transaction of char.transaction) {
              if (user?.id == transaction.card?.user?.id) {
                response.charge_information = [char];
              }
            }
          }
        }
        return response;
      }

      /* for (const char of charges) {
        if (char.transaction.length > 0)
          for (const transaction of char.transaction) {
            if (user.id == transaction.card.user.id) {
              allUsers[allUsers.length - 1].charge_information = [char];
            }
          }
      }*/
    }

    //if (allUsers.length == 0) throw new HttpException('USER_NOT_FOUND', 400);
    return {} as User;
  }

  async getUserByUserName(username: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select(['user', 'company.id'])
      .where('user.username = :username', { username })
      .getOne();
    /*const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });*/
    if (!user) {
      return new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async deleteUser(id: number, userParams: any): Promise<any> {
    let myCompany = [];
    let arrayallcompany = [];
    const companies_son = await this.clientService.getMyClientsTree(
      userParams.company,
      userParams.roles,
    );
    function addCompanies(companies) {
      for (const company of companies) {
        arrayallcompany.push({ ...company }); // Add the company as a charger

        if (company.company_son) {
          // Check if it has child companies
          addCompanies(company.company_son); // Recursively add the child companies
        }
      }
    }

    if (!companies_son.status) myCompany = companies_son;
    myCompany.push({ id: userParams.company, name: 'My Company' } as Company);
    addCompanies(myCompany);
    for (const company of arrayallcompany) {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.client', 'company')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.isActive',
          'user.username',
          'user.email',
          'user.direction',
          'user.dni',
          'user.roles',
          'company.id',
        ])
        .where('user.clientId = :idcompany', { idcompany: company.id })
        .andWhere('user.id = :id', { id })
        .getOne();
      if (user) {
        const userdelete = await this.userRepository.delete({ id: user.id });
        if (userdelete.affected === 0) {
          throw new HttpException('USER_NOT_FOUND', 400);
        }
        return user;
      }
    }
    return {} as User;
  }

  async updateUser(
    id: number,
    user: userUpdateDto,
    userParams: any,
  ): Promise<any> {
    let myCompany = [];
    let arrayallcompany = [];
    const companies_son = await this.clientService.getMyClientsTree(
      userParams.company,
      userParams.roles,
    );
    function addCompanies(companies) {
      for (const company of companies) {
        arrayallcompany.push({ ...company }); // Add the company as a charger

        if (company.company_son) {
          // Check if it has child companies
          addCompanies(company.company_son); // Recursively add the child companies
        }
      }
    }

    if (!companies_son.status) myCompany = companies_son;
    myCompany.push({ id: userParams.company, name: 'My Company' } as Company);
    addCompanies(myCompany);
    for (const company of arrayallcompany) {
      const usercompany = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.client', 'company')
        .select(['user.id', 'company.id'])
        .where('user.clientId = :idcompany', { idcompany: company.id })
        .andWhere('user.id = :id', { id })
        .getOne();

      if (usercompany) {
        await this.userRepository.update({ id }, user);
        const userresponse = await this.userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.client', 'company')
          .select([
            'user.id',
            'user.firstName',
            'user.lastName',
            'user.isActive',
            'user.username',
            'user.email',
            'user.direction',
            'user.dni',
            'user.roles',
            'company.id',
          ])
          .where('user.id = :id', { id })
          .getOne();
        return userresponse;
      }
    }
    return {} as User;
  }

  //---------------------USUARIOS EN EL ARBOL DE COMPAñIAS ---------------------------------------

  //SERVICIO PARA DETERMINAR SI LA COMAñIA ES HIJA
  async companyIsMySon(id_company: number, id_son: number): Promise<any> {
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

    const treeClient = await getMyClientsTreeA(id_company, this.dataSource);
    if (treeClient.length == 0) {
      throw new HttpException('CLIENT_NOT_FOUND_THIS_COMPANY', 400);
    }

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

  async createClientSon(
    user: createUserDto,
    id_client: number,
    id_client_son: number,
  ): Promise<User> {
    const client = await this.clientRepository.findOne({
      where: {
        id: id_client_son,
      },
    });
    if (!client) {
      throw new HttpException('CLIENT_NOT_FOUND_THIS_COMPANY', 400);
    }

    const userFind = await this.userRepository.findOne({
      //BUSCAR PARA QUE NO EXISTAN USUARIOS REPETIDOS
      where: {
        username: user.username,
      },
    });
    if (userFind) {
      throw new HttpException('USER_EXIST', HttpStatus.CONFLICT);
    }
    if (id_client != id_client_son) {
      if (!(await this.companyIsMySon(id_client, id_client_son)))
        throw new HttpException('THIS_COMPANY_NOT_RELATION', 400);
    }

    user.password = await hash(user.password, 10);
    user.client = client;
    await this.clientRepository.save(client);
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async deleteUserOtherCompanySon(
    id: number,
    id_company: number,
  ): Promise<{ success: boolean }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.username',
        'user.email',
        'user.direction',
        'user.dni',
        'user.roles',
        'company.id',
      ])
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new HttpException('USER_NOT_THIS_COMPANY', 400);
    }

    if (id_company != user.client.id) {
      if (!(await this.companyIsMySon(id_company, user.client.id)))
        throw new HttpException('THIS_COMPANY_NOT_RELATION', 400);
    }

    const userdelete = await this.userRepository.delete({ id: user.id });
    if (userdelete.affected === 0) {
      throw new HttpException('USER_NOT_FOUND', 400);
    }
    return { success: true };
  }

  async updateUserOtherCompanySon(
    id: number,
    user: userUpdateDto,
    id_company: number,
  ): Promise<any> {
    const usercompany = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select(['user.id', 'company.id'])
      .where('user.id = :id', { id })
      .getOne();
    if (!usercompany) {
      throw new HttpException('USER_NOT_THIS_COMPANY', 400);
    }
    if (id_company != usercompany.client.id) {
      if (!(await this.companyIsMySon(id_company, usercompany.client.id)))
        throw new HttpException('THIS_COMPANY_NOT_RELATION', 400);
    }

    const response = await this.userRepository.update({ id }, user);
    if (response.affected === 0) {
      throw new HttpException('USER_NOT_FOUND', 400);
    }

    const userresponse = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'company')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.username',
        'user.email',
        'user.direction',
        'user.dni',
        'user.roles',
        'company.id',
      ])
      .where('user.id = :id', { id })
      .getOne();
    return userresponse;
  }

  async exportUserCSV(res: Response, user: any) {
    const listUser = await this.getUser(user);
    let record = [];

    listUser.forEach((item) => {
      record.push({
        firstName: item.firstName,
        lastName: item.lastName,
        username: item.username,
        email: item.email,
        direction: item.direction,
        dni: item.dni,
      });
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'firstName', title: 'Nombre' },
        { id: 'lastName', title: 'Apellidos' },
        { id: 'username', title: 'Usuario' },
        { id: 'email', title: 'Correo eléctronico' },
        { id: 'direction', title: 'Dirección' },
        { id: 'dni', title: 'dni' },
      ],
      fieldDelimiter: ';',
    });

    const csvString =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(record);

    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename=user.csv');
    res.send(csvString);
  }
}
