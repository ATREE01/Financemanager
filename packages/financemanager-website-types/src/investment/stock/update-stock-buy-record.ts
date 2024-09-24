import { StockBuyRecord } from "./stock-buy-record";

export interface UpdateStockBuyRecord extends Omit<StockBuyRecord, "bank"> {
  bankId: string;
}
