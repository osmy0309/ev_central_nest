import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Charge } from './charge.entity';

@Entity()
export class Conector {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ default: 3 })
  state?: number; // 1- Libre, 2- cargando, 3- off, 4- Deshabilitado

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_connection: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.conector, {
    //cascade: true,
  })
  public transaction: Transaction[];

  @ManyToOne(() => Charge, (charge) => charge.conector, {
    // onDelete: 'CASCADE',
    nullable: true,
  })
  charge: Charge;
}
