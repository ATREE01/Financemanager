import { StockBuyRecord } from "./stock-buy-record";

export interface CreateStockBuyRecord
  extends Omit<StockBuyRecord, "id" | "bank"> {
  bankId: string;
}
