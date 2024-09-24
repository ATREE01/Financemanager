import {
  CreateStockBuyRecord,
  StockBuyMethod,
} from '@financemanager/financemanager-webiste-types';

export class CreateStockBuyRecordDto implements CreateStockBuyRecord {
  id: number;
  date: string;
  bankId: string;
  buyMethod: StockBuyMethod;
  shareNumber: number;
  charge: number;
  amount: number;
  note: string;
}
