import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'oprieto',
    description: 'El usuario que va autenticarse',
  })
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  @IsString()
  @ApiProperty({
    example: '12345678',
    description: 'La contraseña del usuario',
  })
  password: string;
}
