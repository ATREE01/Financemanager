import {
  StockBuyMethod,
  UpdateStockBuyRecord,
} from '@financemanager/financemanager-website-types';

export class UpdateStockBuyRecordDto implements UpdateStockBuyRecord {
  id: number;
  date: string;
  bankId: string;
  buyMethod: StockBuyMethod;
  shareNumber: number;
  charge: number;
  amount: number;
  note: string;
}
