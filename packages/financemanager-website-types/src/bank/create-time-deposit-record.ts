import { TimeDepositRecord } from "./time-deposit-record";

export interface CreateTimeDepositRecord
  extends Omit<TimeDepositRecord, "id" | "userId" | "bank"> {
  bankId: string;
}
