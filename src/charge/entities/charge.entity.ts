import { Card } from 'src/card/entities/card.entity';
import { Company } from 'src/client/entities/client.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Card_Charge } from './card_charge.entity';

@Entity()
export class Charge {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  serial_number: string;

  @Column({ type: 'float', default: () => 0 })
  total_charge: number;

  @Column()
  maximum_power: number;

  @Column({ default: () => 0 })
  conectors: number;

  @Column()
  latitude: string;

  @Column()
  length: string;

  @Column()
  municipality: string;

  @Column()
  address: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_connection: Date;

  @OneToMany(() => Card_Charge, (card_charge) => card_charge.charge, {
    cascade: true,
  })
  public card_charge: Card_Charge[];

  @OneToMany(() => Transaction, (transaction) => transaction.charge, {
    cascade: true,
  })
  public transaction: Transaction[];

  @ManyToOne(() => Company, (client) => client.users, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  client: Company;
}
