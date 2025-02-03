import { Bank } from "./bank";

export interface CreateBank
  extends Omit<
    Bank,
    | "id"
    | "currency"
    | "userId"
    | "order"
    | "incExpRecords"
    | "bankRecords"
    | "stockBuyRecords"
    | "stockBundleSellRecords"
    | "timeDepositRecords"
  > {
  currencyId: number;
}
