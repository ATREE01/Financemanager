import { Bank } from "./bank";

export interface CreateBank extends Omit<Bank, "id" | "currency"> {
  currencyId: number;
}
