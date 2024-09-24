import { User } from "../../user/user";
import { stock } from "./stock";

export interface UserStock {
  id: string;
  user: User;
  name: string;
  stock: stock;
}
