import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
// import { hash } from 'bcrypt';
//import { Enterprise } from '../../enterprises/entities/enterprice.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  no_serie: string;

  @Column()
  idTarjetaPadre?: number;

  @Column({ type: 'float', default: () => 0 })
  balance: number;

  /*@OneToMany(() => Enterprise, (enterprise) => enterprise.user)
  enterprises: Enterprise[];*/
  @ManyToOne(() => User, (user) => user.cards)
  user: User;
}
