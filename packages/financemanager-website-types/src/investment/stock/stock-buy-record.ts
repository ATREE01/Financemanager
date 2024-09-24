import { Bank } from "../../bank/bank";
import { StockBuyMethod } from "./enum/type";

export interface StockBuyRecord {
  id: number;
  date: string;
  bank: Bank;
  buyMethod: StockBuyMethod;
  shareNumber: number;
  charge: number;
  amount: number;
  note: string;
}
