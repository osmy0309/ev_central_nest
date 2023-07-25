import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  /*BeforeInsert, BeforeUpdate,*/ OneToMany,
  ManyToMany,
} from 'typeorm';
import { RolName } from './rol.enum';
// import { hash } from 'bcrypt';
//import { Enterprise } from '../../enterprises/entities/enterprice.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  rolname: RolName;

  @ManyToMany((type) => Rol, (rol) => rol.usuarios)
  usuarios: User[];
}
