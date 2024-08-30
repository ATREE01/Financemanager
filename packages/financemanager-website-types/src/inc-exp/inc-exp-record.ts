import { Bank } from "../bank/bank";
import { Category } from "../category/category";
import { Currency } from "../currency/currency";
import { IncExpMethodType, IncExpRecordType } from "./enum/type";

export interface IncExpRecord {
  id: number;
  userId: string;
  date: string;
  type: IncExpRecordType;
  category: Category;
  currency: Currency;
  amount: number;
  method: IncExpMethodType;
  bank: Bank | null;
  charge: number | null;
  note: string | null;
}
