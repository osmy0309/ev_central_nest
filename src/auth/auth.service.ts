import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { registerUserDto } from './dto/register.dto';
import { loginUserDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { jwtConstants } from './constants/constanst';
import { AppRoles } from 'src/rol/app.roles';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h',
    });
  }

  /* async register(userObjet: registerUserDto): Promise<any> {
    return this.usersService.create(userObjet);
  }*/
  logoutall(): any {
    return { message: 'Success' };
  }

  async login(userObjet: loginUserDto): Promise<any> {
    const { username, password } = userObjet;
    const findUser = await this.usersService.getUserByUserName(username);
    if (findUser.response == 'USER_NOT_FOUND') {
      throw new HttpException(
        'Unable to log in with provided credentials.',
        400,
      );
    }
    if (!(await compare(password, findUser.password)))
      throw new HttpException(
        'Unable to log in with provided credentials.',
        400,
      );
    console.log(findUser);
    const payload = {
      userid: findUser.id,
      username: username,
      jti: v4(),
      roles: findUser.roles,
      company: findUser.client.id,
    };
    const token = await this.generateToken(payload);
    delete findUser['password'];
    const data = {
      user: findUser,
      token,
    };
    return data;
  }

  async profileService(id: number): Promise<any> {
    try {
      const findUser = await this.usersService.getUserById(id);
      if (findUser.response == 'USER_NOT_FOUND') {
        throw new HttpException(
          'Unable to log in with provided credentials.',
          400,
        );
      }
      delete findUser['password'];

      return findUser;
    } catch (e) {
      console.log(e); // pasa el objeto de la excepción al manejador de errores
    }
  }
}
