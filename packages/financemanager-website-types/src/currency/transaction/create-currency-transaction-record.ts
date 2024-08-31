import { CurrencyTransactionRecord } from "./currency-transaction-record";

export interface CreateCurrencyTransactionRecord
  extends Omit<
    CurrencyTransactionRecord,
    "id" | "userId" | "fromCurrency" | "toCurrency" | "fromBank" | "toBank"
  > {
  fromBankId: string | null;
  toBankId: string | null;
  fromCurrencyId: number | null;
  toCurrencyId: number | null;
}
