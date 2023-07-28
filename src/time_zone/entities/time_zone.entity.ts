import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Timezone {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  start: Date;

  @Column({ type: 'datetime' })
  finish: Date;

  @Column({ default: () => 0 })
  energy: number;

  @Column({ default: () => 0 })
  deltaEnergy: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.timezones, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
