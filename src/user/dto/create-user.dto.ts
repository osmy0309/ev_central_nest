import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  MaxLength,
  IsEnum,
  isArray,
  IsArray,
} from 'class-validator';
import { AppRoles } from 'src/rol/app.roles';
import { RolName } from 'src/rol/entities/rol.enum';

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  direction: string;

  @IsString()
  dni: string;

  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: `must be a valid role value admin or autor`,
  })
  roles: string[];

  /* @IsEnum(RolName, { message: 'Los roles establecidos son user o admin' })
  rolname: RolName;*/
}

export class updateUserDto {
  @IsString()
  username?: string;

  @MinLength(8)
  @IsString()
  password?: string;

  @IsString()
  firstName?: string;

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
}
