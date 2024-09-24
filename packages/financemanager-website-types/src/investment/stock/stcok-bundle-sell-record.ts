import { Bank } from "../../bank/bank";
import { BrokerageFirm } from "../brokerage-firm/brokerage-firm";
import { StockSellRecord } from "./stock-sell-record";
import { UserStock } from "./user-stock";

export interface StockBundleSellRecord {
  id: number;
  date: string;
  bank: Bank;
  brokerageFirm: BrokerageFirm;
  userStock: UserStock;
  sellPrice: number;
  sellExchangeRate: number;
  charge: number;
  tax: number;
  amount: number;
  note: string | null;
  stockSellRecords: StockSellRecord[];
}
