import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { Category } from '@/src/category/entities/category.entity';
import { Currency } from '@/src/currency/entities/currency.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('IncExpRecords')
export class IncExpRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.incExpRecords)
  user: User;

  @Column({
    type: 'date',
  })
  date: Date;

  @Column()
  type: string;

  @ManyToOne(() => Category, (category) => category.incExpRecords)
  category: Category;

  @ManyToOne(() => Currency, (currency) => currency.incExpRecords)
  currency: Currency;

  @Column()
  amount: number;

  @Column()
  method: string;

  @ManyToOne(() => Bank, (bank) => bank.incExpRecords, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  bank: Bank | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  charge: number | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string | null;
}
