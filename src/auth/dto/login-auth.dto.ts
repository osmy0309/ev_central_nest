import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'arodrigueza@napptilus.com',
    description: 'El usuario que va autenticarse',
  })
  username: string;

  //@IsNotEmpty()
  @IsOptional()
  @MinLength(4)
  @MaxLength(12)
  @IsString()
  /*@ApiProperty({
    example: '12345678',
    description: 'La contraseña del usuario',
  })*/
  password?: string;
}
