import { BrokerageFirm } from "../brokerage-firm/brokerage-firm";
import { StockBundleSellRecord } from "./stcok-bundle-sell-record";

export interface UpdateStockBundleSellRecord
  extends Omit<
    StockBundleSellRecord,
    "bank" | "userStock" | "brokerageFirm" | "stockSellRecords"
  > {
  bankId: string;
  brokerageFirm: BrokerageFirm;
}
