import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsEmail,
} from 'class-validator';
export type UserDetails = {
  email: string;
  displayName: string;
};
