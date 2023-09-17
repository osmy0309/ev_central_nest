import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { tokendDto } from './dto/token.dto';

@Injectable()
export class AuthOauthService {
  async validateToken(token: tokendDto): Promise<any> {
    console.log('here');
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
        return response.data;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
