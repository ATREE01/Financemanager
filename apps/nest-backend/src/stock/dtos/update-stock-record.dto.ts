import {
  UpdateStockBuyRecord,
  UpdateStockRecord,
} from '@financemanager/financemanager-webiste-types';

export class UpdateStockRecordDto implements UpdateStockRecord {
  id: number;
  brokerageFirmId: string;
  userStockId: string;
  buyPrice: number;
  buyExchangeRate: number;
  updateStockBuyRecord: UpdateStockBuyRecord;
}
