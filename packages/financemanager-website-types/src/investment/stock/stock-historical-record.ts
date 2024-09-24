import { stock } from "./stock";

export interface StockHistoricalRecord {
  id: number;
  stock: stock;
  date: Date;
  year: number;
  week: number;
  close: number;
}
