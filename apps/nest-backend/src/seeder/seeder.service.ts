import { CurrencyNames } from '@financemanager/financemanager-webiste-types';
import { Injectable } from '@nestjs/common';

import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class SeederService {
  constructor(private readonly currencyService: CurrencyService) {}
  async seedCurrency() {
    for (const code of Object.keys(CurrencyNames)) {
      await this.currencyService.createCurrency(code, CurrencyNames[code], 0);
    }
  }
}
