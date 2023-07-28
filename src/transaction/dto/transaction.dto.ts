import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class createTrasactionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'El usuario que va autenticarse',
  })
  chargeId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'El usuario que va autenticarse',
  })
  cardId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'El usuario que va autenticarse',
  })
  estado: number;
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
