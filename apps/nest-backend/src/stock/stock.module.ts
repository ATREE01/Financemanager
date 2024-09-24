import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Stock } from './entities/stock.entity';
import { StockBundleSellRecord } from './entities/stock-bundle-sell-record.entity';
import { StockBuyRecord } from './entities/stock-buy-record.entity';
import { StockHistory } from './entities/stock-history.entity';
import { StockRecord } from './entities/stock-record.entity';
import { StockSellRecord } from './entities/stock-sell-reocrd.entity';
import { UserStock } from './entities/user-stock.entity';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { StockHistoryProcessor } from './stock-history.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'StockHistory',
    }),
    TypeOrmModule.forFeature([
      Stock,
      StockRecord,
      StockBuyRecord,
      StockSellRecord,
      StockBundleSellRecord,
      StockSellRecord,
      StockHistory,
      UserStock,
    ]),
  ],
  controllers: [StockController],
  providers: [StockService, StockHistoryProcessor],
  exports: [StockService],
})
export class StockModule {}
