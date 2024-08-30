import { UserCurrency } from "./user-currency";

export interface CreateUserCurrency
  extends Omit<UserCurrency, "id" | "userId" | "currency"> {
  currencyId: number;
}
