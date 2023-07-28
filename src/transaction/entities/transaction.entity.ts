import { Card } from 'src/card/entities/card.entity';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Charge } from '../../charge/entities/charge.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public chargeId: number;

  @Column()
  public cardId: number;

  @Column()
  public estado: number;

  @ManyToOne(() => Charge, (charge) => charge.transaction)
  public charge: Charge;

  @ManyToOne(() => Card, (card) => card.transaction)
  public card: Card;

  @OneToMany(() => Timezone, (timezone) => timezone.transaction)
  timezones: Timezone[];
}
