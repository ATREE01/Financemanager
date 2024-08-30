import { Bank } from "./bank";
import { BankRecordType } from "./enum/type";

export interface BankRecord {
  id: number;
  userId: string;
  type: BankRecordType;
  date: string;
  bank: Bank;
  amount: number;
  charge: number | null;
  note: string | null;
}
