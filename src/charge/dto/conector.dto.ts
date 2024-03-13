import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Charge } from '../entities/charge.entity';

export class createConectorDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1',
    description: 'numero del conector',
  })
  name: string;

  @IsOptional()
  @IsNumber()
  state?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '2023-07-31',
    description: 'Ultima conexion',
  })
  last_connection?: Date;

  @IsOptional()
  charge: Charge;
}
