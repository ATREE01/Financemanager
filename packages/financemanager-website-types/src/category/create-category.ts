import { Category } from "./category";

export interface CreateCategory
  extends Omit<Category, "id" | "userId" | "order"> {}
