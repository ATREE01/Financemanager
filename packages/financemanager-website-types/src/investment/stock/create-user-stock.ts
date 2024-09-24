import { UserStock } from "./user-stock";

export interface CreateUserStock
  extends Omit<UserStock, "id" | "user" | "stock"> {
  code: string;
}
