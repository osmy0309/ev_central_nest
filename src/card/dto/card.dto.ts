import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '123',
    description: 'El usuario que va autenticarse',
  })
  no_serie: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '1 Opcional',
    description: 'El usuario que va autenticarse',
  })
  idTarjetaPadre?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'El usuario que va autenticarse',
  })
  balance: number;

  @IsOptional()
  user?: User;
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

export class asingCardDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'el id de la tarjeta y el usuario a la que se valla a asignar',
  })
  id_card: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'el id de la tarjeta y el usuario a la que se valla a asignar',
  })
  id_user: number;
}
