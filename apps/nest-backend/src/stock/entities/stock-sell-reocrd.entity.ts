import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { StockBundleSellRecord } from './stock-bundle-sell-record.entity';
import { StockRecord } from './stock-record.entity';

@Entity('StockSellRecord')
export class StockSellRecord {
  @PrimaryGeneratedColumn() // TODO: maybe change to UUID to prevent guessing
  id: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
  })
  shareNumber: number;

  @ManyToOne(() => StockRecord, (stockRecord) => stockRecord.stockSellRecords, {
    onDelete: 'CASCADE',
  })
  stockRecord: StockRecord;

  @ManyToOne(
    () => StockBundleSellRecord,
    (stockBundleSellRecord) => stockBundleSellRecord.stockSellRecords,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  stockBundleSellRecord: StockBundleSellRecord;
}
