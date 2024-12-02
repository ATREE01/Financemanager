import { BrokerageFirm } from "./brokerage-firm";

export interface CreateBrokerageFirm
  extends Omit<
    BrokerageFirm,
    "id" | "user" | "transactionCurrency" | "settlementCurrency" | "order"
  > {
  transactionCurrencyId: number;
  settlementCurrencyId: number;
}
