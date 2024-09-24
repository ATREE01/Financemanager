import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Currency } from '@/src/currency/entities/currency.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('BrokerageFirm')
export class BrokerageFirm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  name: string;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  transactionCurrency: Currency;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  settlementCurrency: Currency;

  @Column()
  order: number;
}
