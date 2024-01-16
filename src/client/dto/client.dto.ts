import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class createClientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'nombre de la compañia',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'email del cliente',
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'razon social',
    description: 'razon social del cliente',
  })
  business_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'contactName',
    description: 'contactName',
  })
  contactName: string;

  @IsOptional()
  @IsNumber()
  /* @ApiProperty({
    example: 0,
    description: 'id padre del arbol de cleintes',
  })*/
  id_pather: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '5632147',
    description: 'telefono del cliente',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Barcelona',
    description: 'dirección del cliente',
  })
  direction: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'nif',
    description: 'nif del cliente',
  })
  nif: string;
}

export class updateClientDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'email del cliente',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'razon social',
    description: 'razon social del cliente',
  })
  business_name?: string;

  @IsOptional()
  @IsNumber()
  /* @ApiProperty({
    example: 0,
    description: 'id padre del arbol de cleintes',
  })*/
  id_pather?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'contactName',
    description: 'contactName',
  })
  contactName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '5632147',
    description: 'telefono del cliente',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Barcelona',
    description: 'dirección del cliente',
  })
  direction?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'nif',
    description: 'nif del cliente',
  })
  nif?: string;
}
