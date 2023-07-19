import { IsNotEmpty, IsString } from 'class-validator';

export class connectDto {
  // @IsNotEmpty()
  @IsString()
  identity: string;
}
