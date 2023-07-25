import { Card } from 'src/card/entities/card.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  /*BeforeInsert, BeforeUpdate,*/ OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// import { hash } from 'bcrypt';
//import { Enterprise } from '../../enterprises/entities/enterprice.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  direction: string;

  @Column()
  dni: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'simple-array' })
  roles: string[];

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @ManyToMany((type) => User, (user) => user.rol)
  @JoinTable({
    name: 'user_rol',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'rolId' },
  })
  rol: Rol[];
}
