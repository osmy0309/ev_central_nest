import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class createCard_ChargerDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'El usuario que va autenticarse',
  })
  chargeId: number | null;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: 'El usuario que va autenticarse',
  })
  cardId: number | null;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'El usuario que va autenticarse',
  })
  estado: number;
}

export class updateCard_ChargerDto {
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

export class deleteCard_ChargerDto {
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
