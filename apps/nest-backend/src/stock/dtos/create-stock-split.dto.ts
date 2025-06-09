import { CreateStockSplit } from '@financemanager/financemanager-website-types';

export class CreateStockSplitDto implements CreateStockSplit {
  userStockId: string;
  splitRatio: number;
}
