import { CreateUserStock } from '@financemanager/financemanager-webiste-types';

export class CreateUserStockDto implements CreateUserStock {
  code: string;
  name: string;
}
