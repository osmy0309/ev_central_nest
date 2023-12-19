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
import { Company } from 'src/client/entities/client.entity';
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
  clientSonId?: number;

  @IsOptional()
  client?: Company;

  /* @IsEnum(RolName, { message: 'Los roles establecidos son user o admin' })
  rolname: RolName;*/
}

export class userUpdateDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'oprieto',
    description: 'usuario',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'admin123',
    description: 'password del usuario',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'administrador',
    description: 'Nombre de usuario',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Jefe',
    description: 'Apellidos del usuario',
  })
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'email del usuario',
  })
  email?: string;

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
  dni?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: `must be a valid role value admin or autor`,
  })
  @ApiProperty({
    example: ['ADMIN, AUTOR'],
    description: 'Rol del usuario hasta el momento ADMIN o AUTOR',
  })
  roles?: string[];

  @IsOptional()
  client?: Company;

  /* @IsEnum(RolName, { message: 'Los roles establecidos son user o admin' })
  rolname: RolName;*/
}
