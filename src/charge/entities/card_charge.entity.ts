import { Card } from 'src/card/entities/card.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Charge } from './charge.entity';

@Entity()
export class Card_Charge {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public chargeId: number | null;

  @Column({ nullable: true })
  public cardId: number | null;

  @Column()
  public estado: number;

  @ManyToOne(() => Charge, (charge) => charge.card_charge, {
    //onDelete: 'CASCADE',
    nullable: true,
  })
  public charge: Charge;

  @ManyToOne(() => Card, (card) => card.card_charge, {
    //onDelete: 'CASCADE',
    nullable: true,
  })
  public card: Card;
}
