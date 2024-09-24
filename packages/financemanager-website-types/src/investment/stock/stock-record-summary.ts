import { User } from "../../user/user";
import { BrokerageFirm } from "../brokerage-firm/brokerage-firm";
import { UserStock } from "./user-stock";

export interface StockRecordSummary {
  id: number;
  user: User;
  brokerageFirm: BrokerageFirm;
  userStock: UserStock;
  buyPrice: number;
  buyExchangeRate: number;
  totalSoldCost: number;
  realizedGain: number;
  shareNumber: number;
  amount: number;
}
