import { BankRecord } from "./bank-record";

export interface CreateBankRecord
  extends Omit<BankRecord, "id" | "userId" | "bank"> {
  bankId: string;
}
