import { Currency } from "../../currency/currency";
import { User } from "../../user/user";

export interface BrokerageFirm {
  id: string;
  user: User;
  name: string;
  transactionCurrency: Currency;
  settlementCurrency: Currency;
  order: number;
}
