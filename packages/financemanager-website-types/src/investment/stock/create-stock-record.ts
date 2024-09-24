import { CreateStockBuyRecord } from "./create-stock-buy-record";
import { StockRecord } from "./stock-record";

export interface CreateStockRecord
  extends Omit<
    StockRecord,
    | "id"
    | "stockBuyRecords"
    | "stockSellBundleRecords"
    | "user"
    | "brokerageFirm"
    | "userStock"
  > {
  brokerageFirmId: string;
  userStockId: string;
  buyPrice: number;
  buyExchangeRate: number;
  createStockBuyRecord?: CreateStockBuyRecord;
}
