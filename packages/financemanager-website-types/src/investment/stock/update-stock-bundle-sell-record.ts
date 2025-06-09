import { BrokerageFirm } from "../brokerage-firm/brokerage-firm";
import { StockBundleSellRecord } from "./stock-bundle-sell-record";

export interface UpdateStockBundleSellRecord
  extends Omit<
    StockBundleSellRecord,
    "bank" | "userStock" | "brokerageFirm" | "stockSellRecords"
  > {
  bankId: string;
  brokerageFirm: BrokerageFirm;
}
