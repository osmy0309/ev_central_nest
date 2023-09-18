import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { tokendDto } from './dto/token.dto';

@Injectable()
export class AuthOauthService {
  constructor(private userService: UserService) {}
  async validateToken(token: tokendDto): Promise<any> {
    console.log(`Bearer ${token.token}`);
    try {
      const response = await axios.get(
        'https://auth-int.simon-cloud.com/api/v1/token',
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        },
      );
      if (response.status === 200 && response.statusText == 'OK') {
        const userEmail = await this.userService.getUserByUserEmail(
          response.data.user.email,
        );
        console.log(userEmail);
        return response.data;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
