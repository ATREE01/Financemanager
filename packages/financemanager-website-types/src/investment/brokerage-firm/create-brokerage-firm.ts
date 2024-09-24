import { BrokerageFirm } from "./brokerage-firm";

export interface CreateBrokerageFirm
  extends Omit<
    BrokerageFirm,
    "id" | "userId" | "transactionCurrency" | "settlementCurrency" | "order"
  > {
  transactionCurrencyId: number;
  settlementCurrencyId: number;
}
