import { Card_Charge } from 'src/charge/entities/card_charge.entity';
import { Company } from 'src/client/entities/client.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
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

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  idTarjetaPadre?: number;

  @Column({ nullable: true })
  userId: number | null;

  @Column({ type: 'float', default: () => 0 })
  credit: number;

  @ManyToOne(() => User, (user) => user.cards, {
    // onDelete: 'CASCADE',
    nullable: true,
  })
  user: User;

  @ManyToOne(() => Company, (company) => company.cards, {
    //onDelete: 'CASCADE',
    nullable: true,
  })
  company: Company;

  @OneToMany(() => Card_Charge, (card_charge) => card_charge.card, {
    //cascade: true,
  })
  public card_charge: Card_Charge[];

  @OneToMany(() => Transaction, (transaction) => transaction.card, {
    //cascade: true,
  })
  public transaction: Transaction[];
}
