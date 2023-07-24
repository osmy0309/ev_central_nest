import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class createCardDto {
  @IsNotEmpty()
  @IsString()
  no_serie: string;

  @IsNumber()
  idTarjetaPadre?: number;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  user: User;
}
