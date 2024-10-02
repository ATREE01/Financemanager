import { BrokerageFirm } from "./brokerage-firm";

export interface BrokerageStockSummary {
  brokerageFirm: BrokerageFirm;
  stockCode: string;
  closePrice: number;
  netShareNumber: number;
}
