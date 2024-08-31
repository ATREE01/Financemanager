import { Bank } from "../../bank/bank";
import { Currency } from "../currency";
import { CurrencyTransactionRecordType } from "./enum/type";

export interface CurrencyTransactionRecord {
  id: number;
  userId: string;
  date: string;
  type: CurrencyTransactionRecordType;
  fromBank: Bank | null;
  toBank: Bank | null;
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  charge: number;
}
