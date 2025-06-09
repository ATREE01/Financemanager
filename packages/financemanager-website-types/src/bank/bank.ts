import { Currency } from "../currency/currency";
import { IncExpRecord } from "../inc-exp/inc-exp-record";
import { StockBundleSellRecord } from "../investment/stock/stock-bundle-sell-record";
import { StockBuyRecord } from "../investment/stock/stock-buy-record";
import { BankRecord } from "./bank-record";
import { TimeDepositRecord } from "./time-deposit-record";

export interface Bank {
  id: string;
  userId: string;
  name: string;
  currency: Currency;
  order: number;

  incExpRecords: IncExpRecord[];
  bankRecords: BankRecord[];
  stockBuyRecords: StockBuyRecord[];
  stockBundleSellRecords: StockBundleSellRecord[];
  timeDepositRecords: TimeDepositRecord[];
}
