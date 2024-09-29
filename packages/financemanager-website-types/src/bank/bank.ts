import { Currency } from "../currency/currency";
import { StockBundleSellRecord } from "../investment/stock/stcok-bundle-sell-record";
import { StockBuyRecord } from "../investment/stock/stock-buy-record";

export interface Bank {
  id: string;
  userId: string;
  name: string;
  currency: Currency;
  order: number;

  stockBuyRecords: StockBuyRecord[];
  stockBundleSellRecords: StockBundleSellRecord[];
}
