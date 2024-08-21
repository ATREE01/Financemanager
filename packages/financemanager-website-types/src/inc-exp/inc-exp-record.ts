import { Bank } from "../bank/bank";
import { Category } from "../category/category";
import { Currency } from "../currency/currency";

export interface IncExpRecord {
  id: number;
  userId: string;
  date: string;
  type: string;
  category: Category;
  currency: Currency;
  amount: number;
  method: string;
  bank: Bank | null;
  charge: number | null;
  note: string | null;
}
