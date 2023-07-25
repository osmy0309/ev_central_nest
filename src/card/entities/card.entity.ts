import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  no_serie: string;

  @Column({ default: () => 0 })
  idTarjetaPadre?: number;

  @Column({ type: 'float', default: () => 0 })
  balance: number;

  /*@OneToMany(() => Enterprise, (enterprise) => enterprise.user)
  enterprises: Enterprise[];*/
  @ManyToOne(() => User, (user) => user.cards)
  user: User;
}
