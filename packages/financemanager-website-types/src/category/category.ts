import { CategoryType } from "./category-types";

export interface Category {
  id: string;
  userId: string;
  type: CategoryType;
  name: string;
  order: number;
}
