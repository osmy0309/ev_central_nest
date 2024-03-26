import { Card } from 'src/card/entities/card.entity';
import { Conector } from './conector.entity';
import { Company } from 'src/client/entities/client.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
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

  @Column({ unique: false })
  serial_number: string;

  @Column({ type: 'float', default: () => 0 })
  total_charge: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  maximum_power: number;

  @Column({ default: () => 0 })
  conectors: number;

  @Column()
  latitude: string;

  @Column({ default: 3 })
  state?: number; // 1- Libre, 2- cargando, 3- off, 4- Deshabilitado

  @Column()
  longitude: string;

  @Column()
  municipality: string;

  @Column()
  address: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_connection: Date;

  @OneToMany(() => Card_Charge, (card_charge) => card_charge.charge, {
    // cascade: true,
  })
  public card_charge: Card_Charge[];

  @OneToMany(() => Transaction, (transaction) => transaction.charge, {
    // cascade: true,
  })
  public transaction: Transaction[];

  @ManyToOne(() => Company, (client) => client.users, {
    // onDelete: 'CASCADE',
    nullable: true,
  })
  client: Company;

  @OneToMany(() => Conector, (conector) => conector.charge, {
    // cascade: true,
    nullable: true,
  })
  public conector?: Conector[];
}
