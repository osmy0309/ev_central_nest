import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  no_serie: string;

  @Column({ default: () => null })
  idTarjetaPadre?: number;

  @Column({ type: 'float', default: () => 0 })
  balance: number;

  /*@OneToMany(() => Enterprise, (enterprise) => enterprise.user)
  enterprises: Enterprise[];*/
  @ManyToOne(() => User, (user) => user.cards)
  user: User;

  /* @ManyToMany((type) => Card, (card) => card.charges)
  charges: Charge[];*/

  @OneToMany(() => Card_Charge, (card_charge) => card_charge.card)
  public card_charge: Card_Charge[];
}
