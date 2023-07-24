import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  MaxLength,
} from 'class-validator';

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
}
