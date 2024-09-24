import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Stock } from './stock.entity';

@Entity('StockHistory')
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
  date: Date;

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
