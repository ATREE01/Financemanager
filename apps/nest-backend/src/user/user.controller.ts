import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankService } from '../bank/bank.service';
import { CategoryService } from '../category/category.service';
import { CurrencyService } from '../currency/currency.service';
import { IncExpService } from '../inc-exp/inc-exp.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly bankService: BankService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoryService,
    private readonly incExpRecord: IncExpService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/banks')
  async getuserBanks(@Param('id') id: string) {
    return await this.bankService.getByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/currencies')
  async getUserCurrencies(@Param('id') id: string) {
    return await this.currencyService.getUserCurrencies(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/categories')
  async getUserCategories(@Param('id') id: string) {
    return {
      income: await this.categoryService.getIncomeByUserId(id),
      expense: await this.categoryService.getExpenseBuUserId(id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/inc-exp')
  async getUserIncExpRecords(@Param('id') id: string) {
    return await this.incExpRecord.getRecordsByUserId(id);
  }
}
