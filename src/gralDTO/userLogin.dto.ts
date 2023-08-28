import { IsString, IsNumber, IsArray } from 'class-validator';
export class userLoginDto {
  @IsNumber()
  userid: number;
  @IsString()
  username: string;
  @IsString()
  jti: string;
  @IsArray()
  roles: [];
  @IsNumber()
  company: number;
  @IsNumber()
  iat: number;
  @IsNumber()
  exp: number;
}
