import { BrokerageFirm } from "../brokerage-firm/brokerage-firm";
import { StockRecordSummary } from "./stock-record-summary";
import { UserStock } from "./user-stock";

export interface StockSummary {
  brokerageFirm: BrokerageFirm;
  userStock: UserStock;
  stockRecordSummaries: StockRecordSummary[];

  totalSoldCost: number;
  realizedGain: number;
  averageBuyPrice: number;
  totalTransactionCost: number;
  totalSettlementCost: number;
  totalAmount: number; // amount is the value of the real money that user spend on buying the stock including tax and fee
  totalShare: number;
}
