import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class connectDto {
  // @IsNotEmpty()
  @IsNotEmpty()
  @ApiProperty({
    example: 'SMNTST001',
    description: 'Identificador del cargador',
  })
  @IsString()
  identity: string;
}
