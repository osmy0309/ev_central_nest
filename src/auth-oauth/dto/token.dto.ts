import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class tokendDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123',
    description: 'Toekn a validar en servidor oauth2',
  })
  token: string;
}
