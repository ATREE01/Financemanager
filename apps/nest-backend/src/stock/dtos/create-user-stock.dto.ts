import { CreateUserStock } from '@financemanager/financemanager-website-types';

export class CreateUserStockDto implements CreateUserStock {
  code: string;
  name: string;
}
