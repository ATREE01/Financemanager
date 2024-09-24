import { BrokerageFirm } from "../brokerage-firm/brokerage-firm";
import { CreateStockSellRecord } from "./create-stock-sell-record";

export interface StockRecordSummarySell {
  brokerageFirm: BrokerageFirm | null;
  userStockId: string | null;
  stockRecordSellShare: { [stockRecordId: number]: CreateStockSellRecord };
}
