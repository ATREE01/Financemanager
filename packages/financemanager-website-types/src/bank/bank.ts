import { Currency } from "../currency/currency";

export interface Bank {
  id: string;
  userId: string;
  name: string;
  currency: Currency;
}
