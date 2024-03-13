import { Card } from 'src/card/entities/card.entity';
import { Timezone } from 'src/time_zone/entities/time_zone.entity';
import { User } from 'src/user/entities/user.entity';
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

  @Column({ default: null })
  public userId: number;

  @Column({ default: 1 })
  public estado: number;

  @ManyToOne(() => Charge, (charge) => charge.transaction, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public charge: Charge;

  @ManyToOne(() => Card, (card) => card.transaction, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public card: Card;

  @ManyToOne(() => User, (user) => user.transaction, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public user: User;

  @OneToMany(() => Timezone, (timezone) => timezone.transaction, {
    cascade: true,
  })
  timezones: Timezone[];
}
