import {
  CreateCategory,
  IncExpRecordType,
} from '@financemanager/financemanager-website-types';
import { IsEnum, IsString } from 'class-validator';

export class CreateCategoryDto implements CreateCategory {
  @IsString()
  @IsEnum(IncExpRecordType)
  type: IncExpRecordType;

  @IsString()
  name: string;
}
