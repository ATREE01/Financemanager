import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Currency } from '@/src/currency/entities/currency.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('UserCurrencies')
export class UserCurrency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Currency, (currency) => currency.userCurrency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  currency: Currency;

  @ManyToOne(() => User, (user) => user.currency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
