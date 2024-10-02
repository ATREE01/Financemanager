import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { Currency } from '@/src/currency/entities/currency.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('CurrencyTransactionRecord')
export class CurrencyTransactionRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.currencyTransactionRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'date',
  })
  date: Date;

  @Column()
  type: string;

  @ManyToOne(() => Bank, {
    nullable: true,
  })
  fromBank: Bank | null;

  @ManyToOne(() => Bank, {
    nullable: true,
  })
  toBank: Bank | null;

  @ManyToOne(() => Currency, {
    nullable: true,
  })
  fromCurrency: Currency | null;

  @ManyToOne(() => Currency, {
    nullable: true,
  })
  toCurrency: Currency | null;

  @Column()
  fromAmount: number;

  @Column()
  toAmount: number;

  @Column({
    type: 'float',
  })
  exchangeRate: number;

  @Column()
  charge: number;
}
