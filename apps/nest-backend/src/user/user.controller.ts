import {
  BankSummary,
  BrokerageFirmSummary,
  BrokerageStockSummary,
  CurrencyTransactionRecordType,
  IncExpRecordType,
} from '@financemanager/financemanager-webiste-types';
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
import { Bank } from '../bank/entities/bank.entity';
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
    const result = await this.userService.getUserBank(id);
    if (result === null) throw new NotFoundException();
    return result.bank;
  }

  @UseGuards(JwtAuthGuard)
  @Get('banks/records')
  async getUserBankRecords(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    const result = await this.userService.getUserBankRecords(id);
    if (result === null) throw new NotFoundException();
    return result.bankRecords;
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
  @Get('/currencies/transaction/records')
  async getTransactionRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    const result =
      await this.userService.getUserCurrencyTransactionRecords(userId);
    if (result === null || result.currencyTransactionRecords === undefined)
      throw new NotFoundException();
    return result.currencyTransactionRecords;
  }

  @UseGuards(JwtAuthGuard)
  @Get('brokerage-firms')
  async getBrokerageFirms(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    const result = await this.userService.getUserBrokerageFirms(userId);
    if (result === null || result.brokerageFirms === undefined)
      throw new NotFoundException();

    return result.brokerageFirms;
  }

  @UseGuards(JwtAuthGuard)
  @Get('stocks')
  async getUserStocks(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    return await this.stockService.getUserStocksById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stocks/records')
  async getStockRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    const result = await this.userService.getUserStockRecords(userId);
    if (result === null) throw new NotFoundException();

    return result.stockRecords;
  }

  @UseGuards(JwtAuthGuard)
  @Get('stocks/bundle-sell-records')
  async getStockBundleSellRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    const result = await this.userService.getUserStockBundleSellRecords(userId);
    if (result === null) throw new NotFoundException();

    return result.stockBundleSellRecords;
  }

  @UseGuards(JwtAuthGuard)
  @Get('stocks/summaries')
  async getStockSummary(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    const result = await this.userService.getUserStockRecords(userId);
    // this exception only happened when important thing is broken
    if (result === null || result.stockRecords === undefined)
      throw new NotFoundException();

    const stockRecords = result.stockRecords;
    const stockRecordSummaries = stockRecords.map((stockRecord) =>
      this.stockService.summarizeStockRecord(stockRecord),
    );
    return this.stockService.summarizeStock(stockRecordSummaries);
  }

  @UseGuards(JwtAuthGuard)
  @Get('banks/summary')
  async getBankSummary(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    const userBank = await this.userService.getUserBank(userId);
    if (userBank === null) throw new NotFoundException();

    const bankSummary: BankSummary = {};

    (userBank.bank as Bank[]).forEach((bank) => {
      bankSummary[bank.name] = {
        value: 0,
      };

      bank.incExpRecords?.forEach((record) => {
        if (record.type === IncExpRecordType.EXPENSE)
          bankSummary[bank.name].value -= record.amount;
        else if (record.type === IncExpRecordType.INCOME)
          bankSummary[bank.name].value += record.amount;
      });

      bank.bankRecords?.forEach((bankRecord) => {
        bankSummary[bank.name].value += Number(bankRecord.amount);
      });

      bank.stockBuyRecords?.forEach((stockBuyRecord) => {
        bankSummary[bank.name].value -= Number(stockBuyRecord.amount);
      });

      bank.stockBundleSellRecords?.forEach((stockBundleSellRecord) => {
        bankSummary[bank.name].value += Number(stockBundleSellRecord.amount);
      });

      bankSummary[bank.name].value *= bank.currency.exchangeRate;
    });

    const userCurrencyTransactionRecords =
      await this.userService.getUserCurrencyTransactionRecords(userId);
    if (
      userCurrencyTransactionRecords === null ||
      userCurrencyTransactionRecords.currencyTransactionRecords === undefined
    )
      throw new NotFoundException();

    const currencyTransactionRecords =
      userCurrencyTransactionRecords.currencyTransactionRecords;
    currencyTransactionRecords.forEach((record) => {
      if (record.type === CurrencyTransactionRecordType.COUNTER) return;

      const { fromBank, toBank, fromAmount, toAmount } = record;

      if (fromBank) {
        const fromBankName = fromBank.name;
        const fromExchangeRate = fromBank.currency?.exchangeRate ?? 1;
        bankSummary[fromBankName].value -= fromAmount * fromExchangeRate;
      }

      if (toBank) {
        const toBankName = toBank.name;
        const toExchangeRate = toBank.currency?.exchangeRate ?? 1;
        bankSummary[toBankName].value += toAmount * toExchangeRate;
      }
    });

    return bankSummary;
  }

  @UseGuards(JwtAuthGuard)
  @Get('brokerage-firms/summary')
  async getBrokerageFirmSummary(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    const result =
      await this.userService.getUserBrokergaeFirmWithRecords(userId);

    // this exception only happened when important thing is broken
    if (result === null || result.brokerageFirms === undefined)
      throw new NotFoundException();

    const brokerageFirmSummary: BrokerageFirmSummary = {};
    const brokerageFirms = result.brokerageFirms;

    brokerageFirms.forEach((brokerageFirms) => {
      brokerageFirmSummary[brokerageFirms.name] = {
        value: 0,
      };

      if (brokerageFirms.stockRecords === undefined) return;

      const stockRecordShareSummaries: BrokerageStockSummary[] =
        brokerageFirms.stockRecords.map((stockRecord) =>
          this.stockService.sumarizeBrokerageFirmStock(stockRecord),
        );

      const brokerageValue = this.stockService.summarizeBrokerageFirmValue(
        stockRecordShareSummaries,
      );
      brokerageFirmSummary[brokerageFirms.name].value += (brokerageValue *
        brokerageFirms.transactionCurrency?.exchangeRate) as number;
    });

    return brokerageFirmSummary;
  }
}
