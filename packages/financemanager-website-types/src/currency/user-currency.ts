import { Currency } from "./currency";

export interface UserCurrency {
  id: string;
  userId: string;
  currency: Currency;
}
