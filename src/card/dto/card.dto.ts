import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Company } from 'src/client/entities/client.entity';
import { User } from 'src/user/entities/user.entity';

export class createCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123',
    description: 'Numerio de serie de la Tarjeta',
  })
  no_serie: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 0,
    description: 'Tarjeta Padre',
  })
  idTarjetaPadre?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'Balance de la Tarjeta',
  })
  credit: number;

  @IsOptional()
  user?: User | null;

  @IsOptional()
  company?: Company;
}

export class updateCardDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '123',
    description: 'Numerio de serie de la Tarjeta',
  })
  no_serie?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 0,
    description: 'Tarjeta Padre',
  })
  idTarjetaPadre?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'Balance de la Tarjeta',
  })
  credit?: number;

  @IsOptional()
  @ValidateNested()
  user?: User | null;

  @IsOptional()
  company?: Company;
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
