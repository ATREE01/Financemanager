import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Stock } from './stock.entity';

@Entity('StockHistory')
@Unique(['stock', 'year', 'week'])
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stock, (stock) => stock.stockHistory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  stock: Stock;

  @Column({
    type: 'date',
  })
  date: string;

  @Column()
  year: number;

  @Column()
  week: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
  })
  close: number;
}
