import { StockRecord } from "./stock-record";
import { UpdateStockBuyRecord } from "./update-stock-buy-record";

export interface UpdateStockRecord
  extends Omit<
    StockRecord,
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
  updateStockBuyRecord: UpdateStockBuyRecord;
}
