import { IncExpRecord } from "./inc-exp-record";

export interface CreateIncExpRecord
  extends Omit<
    IncExpRecord,
    "id" | "userId" | "category" | "currency" | "bank"
  > {
  categoryId: string;
  currencyId: number;
  bankId: string | null;
}
