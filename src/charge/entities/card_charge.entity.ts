import { Card } from 'src/card/entities/card.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Charge } from './charge.entity';

@Entity()
export class Card_Charge {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public chargeId: number;

  @Column()
  public cardId: number;

  @Column()
  public estado: number;

  @ManyToOne(() => Charge, (charge) => charge.card_charge, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public charge: Charge;

  @ManyToOne(() => Card, (card) => card.card_charge, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public card: Card;
}
