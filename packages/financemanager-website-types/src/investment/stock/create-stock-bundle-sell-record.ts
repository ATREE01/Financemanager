import { CreateStockSellRecord } from "./create-stock-sell-record";
import { StockBundleSellRecord } from "./stcok-bundle-sell-record";

export interface CreateStockBundleSellRecord
  extends Omit<
    StockBundleSellRecord,
    "id" | "bank" | "brokerageFirm" | "userStock" | "stockSellRecords"
  > {
  bankId: string;
  brokerageFirmId: string;
  userStockId: string;
  createStockSellRecords: {
    [stockRecord: number]: CreateStockSellRecord;
  };
}
