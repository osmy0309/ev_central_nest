import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  MaxLength,
  IsArray,
  IsEnum,
} from 'class-validator';
import { AppRoles } from 'src/rol/app.roles';

export class registerUserDto {
  @ApiProperty({
    example: 'oprieto',
    description: 'El usuario que va autenticarse',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: '12345678',
    description: 'El password que va autenticarse',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Osmin',
    description: 'El nombre',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Garcia',
    description: 'El apellido que va autenticarse',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'oprieto@das.com',
    description: 'El email del usuario',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'Casa',
    description: 'La direccion del usuario',
  })
  @IsString()
  direction: string;

  @ApiProperty({
    example: '93102000284',
    description: 'El DNI del usuario',
  })
  @IsString()
  dni: string;

  @ApiProperty({
    example: ['admin'],
    description: 'El rol del usuario',
  })
  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: `must be a valid role value admin or autor`,
  })
  roles: string[];
}

export class updateUserDto {
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsBoolean()
  isActive?: boolean;

  @IsString()
  email?: string;

  @IsString()
  direction?: string;

  @IsString()
  dni?: string;

  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: `must be a valid role value admin or autor`,
  })
  roles?: string[];
}
