import { IncExpRecordType } from "../inc-exp/enum/type";

export interface Category {
  id: string;
  userId: string;
  type: IncExpRecordType;
  name: string;
  order: number;
}
