import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transaction } from 'src/transaction/entities/transaction.entity';
export class createTTimeZoneDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2023-07-31T00:00:00Z',
    description: 'fecha de inicio',
  })
  start: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2023-07-31T00:00:00Z',
    description: 'fecha de fin',
  })
  finish: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'energia',
  })
  energy: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'energia delta',
  })
  deltaEnergy: number;

  @IsOptional()
  transaction: Transaction;
}

export class updateTTimeZoneDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2023-07-31T00:00:00Z',
    description: 'fecha de inicio',
  })
  start: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2023-07-31T00:00:00Z',
    description: 'fecha de fin',
  })
  finish: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'energia',
  })
  energy: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'energia delta',
  })
  deltaEnergy: number;

  @IsOptional()
  transaction: Transaction;
}

export class updateTrasactionDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'El usuario que va autenticarse',
  })
  chargeId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'El usuario que va autenticarse',
  })
  cardId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'El usuario que va autenticarse',
  })
  estado?: number;
}

export class deleteTrasactionDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'El usuario que va autenticarse',
  })
  chargeId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'El usuario que va autenticarse',
  })
  cardId?: number;

  @IsOptional()
  @IsNumber()
  estado?: number;
}
