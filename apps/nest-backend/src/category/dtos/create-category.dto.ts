import {
  CategoryType,
  CreateCategory,
} from '@financemanager/financemanager-webiste-types';
import { IsEnum, IsString } from 'class-validator';

export class CreateCategoryDto implements CreateCategory {
  @IsString()
  @IsEnum(CategoryType)
  type: CategoryType;

  @IsString()
  userId: string;

  @IsString()
  name: string;
}
