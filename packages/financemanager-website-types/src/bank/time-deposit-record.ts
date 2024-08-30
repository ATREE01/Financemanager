import { Bank } from "./bank";

export interface TimeDepositRecord {
  id: number;
  name: string;
  userId: string;
  bank: Bank;
  amount: number;
  interestRate: string;
  startDate: string;
  endDate: string;
}
