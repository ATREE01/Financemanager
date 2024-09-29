import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { StockRecord } from '@/src/stock/entities/stock-record.entity';

@Entity('StockBuyRecords')
export class StockBuyRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StockRecord, (stockRecord) => stockRecord.stockBuyRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  stockRecord: StockRecord;

  @ManyToOne(() => Bank, (bank) => bank.stockBuyRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bank: Bank;

  @Column({
    type: 'date',
  })
  date: string;

  @Column()
  buyMethod: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
  })
  shareNumber: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  charge: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string | null;
}
