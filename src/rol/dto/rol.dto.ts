import { IsEnum } from 'class-validator';
import { RolName } from '../entities/rol.enum';

export class createRolDTO {
  @IsEnum(RolName, { message: 'Los roles establecidos son user o admin' })
  rolname: RolName;
}
