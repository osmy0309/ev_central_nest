import { Card } from 'src/card/entities/card.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({default: 'Cambialo'})
  contactName: string;

  @Column()
  business_name: string;

  @Column({ default: () => 0 })
  id_pather: number;

  @Column()
  phone: string;

  @Column()
  direction: string;

  @Column()
  nif: string;

  @OneToMany(() => User, (user) => user.client, { cascade: true })
  users: User[];

  @OneToMany(() => Charge, (charge) => charge.client, { cascade: true })
  charges: Charge[];

  @OneToMany(() => Card, (card) => card.user, {
    cascade: true,
  })
  cards: Card[];
}
