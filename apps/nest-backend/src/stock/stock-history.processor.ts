import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { StockService } from './stock.service';

@Processor('StockHistory')
export class StockHistoryProcessor extends WorkerHost {
  constructor(private readonly stockService: StockService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<void> {
    const { stock } = job.data;
    switch (job.name) {
      case 'createStockHistory':
        await this.stockService.createStockHistory(stock);
        break;
    }
  }
}
