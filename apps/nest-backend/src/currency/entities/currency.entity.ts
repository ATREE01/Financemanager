import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';

@Entity('Currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({
    type: 'float',
  })
  exchangeRate: number;

  @OneToMany(() => Bank, (bank) => bank.currency)
  bank?: Bank[];
}
