import { Card } from 'src/card/entities/card.entity';
import { Client } from 'src/client/entities/client.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

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

  @ManyToOne(() => Client, (client) => client.users, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  client: Client;

  /*@ManyToMany((type) => User, (user) => user.rol)
  @JoinTable({
    name: 'user_rol',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'rolId' },
  })
  rol: Rol[];*/
}
