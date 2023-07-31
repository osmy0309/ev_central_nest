import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  MaxLength,
  IsEnum,
  IsArray,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Client } from 'src/client/entities/client.entity';
import { AppRoles } from 'src/rol/app.roles';

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'oprieto',
    description: 'usuario',
  })
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  @ApiProperty({
    example: 'admin123',
    description: 'password del usuario',
  })
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'administrador',
    description: 'Nombre de usuario',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Jefe',
    description: 'Apellidos del usuario',
  })
  lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'email del usuario',
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Barcelona',
    description: 'direccion del usuario',
  })
  direction?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '9365487',
    description: 'dni del usuario',
  })
  dni: string;

  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: `must be a valid role value admin or autor`,
  })
  @ApiProperty({
    example: ['ADMIN, AUTOR'],
    description: 'Rol del usuario hasta el momento ADMIN o AUTOR',
  })
  roles: string[];

  @IsOptional()
  client?: Client;

  /* @IsEnum(RolName, { message: 'Los roles establecidos son user o admin' })
  rolname: RolName;*/
}

export class updateUserDto {
  @IsString()
  @ApiProperty({
    example: 'oprieto',
    description: 'usuario',
  })
  username?: string;

  @MinLength(8)
  @IsString()
  @ApiProperty({
    example: 'admin123',
    description: 'password del usuario',
  })
  password?: string;

  @IsString()
  @ApiProperty({
    example: 'administrador',
    description: 'Nombre de usuario',
  })
  firstName?: string;

  @IsString()
  @ApiProperty({
    example: 'Jefe',
    description: 'Apellidos del usuario',
  })
  lastName?: string;

  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'activar o desactivar usuario',
  })
  isActive?: boolean;

  @IsString()
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'email del usuario',
  })
  email?: string;

  @IsString()
  @ApiProperty({
    example: 'Barcelona',
    description: 'direccion del usuario',
  })
  direction?: string;

  @IsString()
  @ApiProperty({
    example: '9365487',
    description: 'dni del usuario',
  })
  dni?: string;

  @ApiProperty({
    example: ['ADMIN, AUTOR'],
    description: 'Rol del usuario hasta el momento ADMIN o AUTOR',
  })
  roles: string[];

  @IsOptional()
  client?: Client;
}
