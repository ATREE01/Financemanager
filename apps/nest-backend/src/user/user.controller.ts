import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankService } from '../bank/bank.service';
import { BrokerageService } from '../borkerage-firm/brokerage.service';
import { CategoryService } from '../category/category.service';
import { CurrencyService } from '../currency/currency.service';
import { IncExpService } from '../inc-exp/inc-exp.service';
import { StockService } from '../stock/stock.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly bankService: BankService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoryService,
    private readonly incExpRecord: IncExpService,
    private readonly brokerageService: BrokerageService,
    private readonly stockService: StockService,
  ) {}

  // TODO: change the get function to get the value from user's realtion instead of id equal to userId

  @UseGuards(JwtAuthGuard)
  @Get('categories')
  async getUserCategories(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    const result = {
      income: await this.categoryService.getIncomeByUserId(id),
      expense: await this.categoryService.getExpenseByUserId(id),
    };
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('inc-exp')
  async getUserIncExpRecords(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    return await this.incExpRecord.getRecordsByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('banks')
  async getUserBanks(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    return await this.bankService.getBankByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('banks/records')
  async getUserBankRecords(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    return await this.bankService.getBankRecordsByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('banks/time-deposit/records')
  async getUserTimeDepositRecords(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    return await this.bankService.getTimeDepositRecordsByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('currencies')
  async getUserCurrencies(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    return await this.currencyService.getUserCurrencies(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('currencies/:id')
  async deleteUserCurrency(@Req() req: Request, @Param('id') id: number) {
    const userId = (req.user as UserInfo).userId;
    if (await this.currencyService.checkUserCurrencyOwnership(id, userId))
      return await this.currencyService.deleteUserCurrency(id, userId);
    else throw new BadRequestException();
  }

  @UseGuards(JwtAuthGuard)
  @Get('brokerage-firms')
  async getBrokerageFirms(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    return await this.brokerageService.getBrokerageFirmsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stocks')
  async getUserStocks(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    return await this.stockService.getUserStocksById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('records')
  async getStockRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    return await this.stockService.getStockRecordsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stocks/summaries')
  async getStockSummary(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    const stockRecords =
      await this.stockService.getStockRecordsByUserId(userId);
    const stockRecordSummaries = stockRecords.map((stockRecord) =>
      this.stockService.summarizeStockRecord(stockRecord),
    );
    return this.stockService.summarizeStock(stockRecordSummaries);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stocks/bundle-sell-records')
  async getStockBundleSellRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    const result = await this.userService.getUserStockBundleSellRecords(userId);
    if (result === null) throw new NotFoundException();
    return result.stockBundleSellRecords;
  }
}
