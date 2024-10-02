import { User } from "../../user/user";
import { BrokerageFirm } from "../brokerage-firm/brokerage-firm";
import { StockBundleSellRecord } from "./stcok-bundle-sell-record";
import { StockBuyRecord } from "./stock-buy-record";
import { UserStock } from "./user-stock";

export interface StockRecord {
  id: number;
  user: User;
  brokerageFirm: BrokerageFirm;
  userStock: UserStock;
  buyPrice: number;
  buyExchangeRate: number;
  stockBuyRecords: StockBuyRecord[];
  stockSellBundleRecords: StockBundleSellRecord[];
}