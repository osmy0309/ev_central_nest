import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class createCardDto {
  @IsNotEmpty()
  @IsString()
  no_serie: string;

  @IsNumber()
  @IsOptional()
  idTarjetaPadre?: number;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  user: User;
}

export class updateCardDto {
  @IsOptional()
  @IsString()
  no_serie?: string;

  @IsOptional()
  @IsNumber()
  idTarjetaPadre?: number;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @ValidateNested()
  user?: User;
}
