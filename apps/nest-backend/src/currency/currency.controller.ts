import { Controller, Get } from '@nestjs/common';

import { CurrencyService } from './currency.service';

@Controller('Currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getCurrencies() {
    return this.currencyService.getCurrencies();
  }
}
