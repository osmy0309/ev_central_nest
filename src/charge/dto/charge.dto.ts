import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Company } from 'src/client/entities/client.entity';

export class createChargerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Cargador1',
    description: 'El usuario que va autenticarse',
  })
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'bd123456',
    description: 'El usuario que va autenticarse',
  })
  serial_number: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '123.25',
    description: 'El usuario que va autenticarse',
  })
  total_charge: number;

  @IsOptional()
  @IsNumber()
  state?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '123',
    description: 'El usuario que va autenticarse',
  })
  maximum_power: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '4',
    description: 'El usuario que va autenticarse',
  })
  conectors: number;

  @IsString()
  @ApiProperty({
    example: 'Una latitud string',
    description: 'El usuario que va autenticarse',
  })
  latitude: string;

  @IsString()
  @ApiProperty({
    example: 'length string',
    description: 'El usuario que va autenticarse',
  })
  length: string;

  @IsString()
  @ApiProperty({
    example: 'municipio',
    description: 'El usuario que va autenticarse',
  })
  municipality: string;

  @IsString()
  @ApiProperty({
    example: 'direccion',
    description: 'El usuario que va autenticarse',
  })
  address: string;

  @IsString()
  @ApiProperty({
    example: '2023-07-31',
    description: 'El usuario que va autenticarse',
  })
  last_connection: Date;

  @IsOptional()
  client: Company;
}

export class updateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Cargador1',
    description: 'El usuario que va autenticarse',
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'bd123456',
    description: 'El usuario que va autenticarse',
  })
  serial_number?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: '123.25',
    description: 'El usuario que va autenticarse',
  })
  total_charge?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: '1- Libre, 2- Reservado, 3- Cargando, 4- Deshabilitado',
  })
  state?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: '123',
    description: 'El usuario que va autenticarse',
  })
  maximum_power?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: '4',
    description: 'El usuario que va autenticarse',
  })
  conectors?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Una latitud string',
    description: 'El usuario que va autenticarse',
  })
  latitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'length string',
    description: 'El usuario que va autenticarse',
  })
  length?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'municipio',
    description: 'El usuario que va autenticarse',
  })
  municipality?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'direccion',
    description: 'El usuario que va autenticarse',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2023-07-31',
    description: 'El usuario que va autenticarse',
  })
  last_connection?: Date;
}
