import {
  BankHistoryData,
  BankSummary,
  BrokerageFirmHistoryData,
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
import * as moment from 'moment';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankService } from '../bank/bank.service';
import { Bank } from '../bank/entities/bank.entity';
import { CategoryService } from '../category/category.service';
import { CurrencyService } from '../currency/currency.service';
import { Stock } from '../stock/entities/stock.entity';
import { StockService } from '../stock/stock.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly bankService: BankService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoryService,
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
    const result = await this.userService.getUserIncExpRecord(id);
    if (result === null) throw new NotFoundException();
    return result.incExpRecords;
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
  @Get('banks/history-data')
  async getbankHistoryData(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    const userBank = await this.userService.getUserBank(userId);
    if (userBank === null || userBank.bank === undefined)
      throw new NotFoundException();

    const now = moment();
    let minYear = now.isoWeekYear(),
      minWeek = now.isoWeek();

    const valueByYearAndWeek: { [year: number]: { [week: number]: number } } =
      {};

    const addValueToYearAndWeek = (
      year: number,
      week: number,
      value: number,
    ) => {
      if (!valueByYearAndWeek[year]) valueByYearAndWeek[year] = {};
      if (!valueByYearAndWeek[year][week]) valueByYearAndWeek[year][week] = 0;

      valueByYearAndWeek[year][week] += value;
      if (year < minYear || (year === minYear && week < minWeek))
        (minYear = year), (minWeek = week);
    };

    userBank.bank.forEach((bank) => {
      bank.incExpRecords?.forEach((record) => {
        const date = moment(record.date);
        const value =
          record.type === IncExpRecordType.EXPENSE
            ? -record.amount
            : record.amount;
        addValueToYearAndWeek(date.year(), date.week(), value);
      });

      bank.bankRecords?.forEach((bankRecord) => {
        const date = moment(bankRecord.date);
        const value = Number(bankRecord.amount);
        addValueToYearAndWeek(date.year(), date.week(), value);
      });

      bank.stockBuyRecords?.forEach((stockBuyRecord) => {
        const date = moment(stockBuyRecord.date);
        const value = -Number(stockBuyRecord.amount);
        addValueToYearAndWeek(date.year(), date.week(), value);
      });

      bank.stockBundleSellRecords?.forEach((stockBundleSellRecord) => {
        const date = moment(stockBundleSellRecord.date);
        const value = Number(stockBundleSellRecord.amount);
        addValueToYearAndWeek(date.year(), date.week(), value);
      });
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
      const date = moment(record.date);
      const year = date.year();
      const week = date.week();
      const { fromBank, toBank, fromAmount, toAmount } = record;
      if (fromBank) {
        const fromExchangeRate = fromBank.currency?.exchangeRate ?? 1;
        addValueToYearAndWeek(year, week, -fromAmount * fromExchangeRate);
      }
      if (toBank) {
        const toExchangeRate = toBank.currency?.exchangeRate ?? 1;
        addValueToYearAndWeek(year, week, toAmount * toExchangeRate);
      }
    });

    const bankHistoryData = [] as BankHistoryData[];
    const date = moment().isoWeekYear(minYear).isoWeek(minWeek);
    let value = 0;
    for (let year = minYear; year <= now.year(); year++) {
      const startWeek = year === minYear ? minWeek : 1;
      const endWeek =
        year === now.year()
          ? now.isoWeek() - 1
          : moment().isoWeekYear(year).isoWeeksInYear();
      for (let week = startWeek; week <= endWeek; week++) {
        if (valueByYearAndWeek[year] && valueByYearAndWeek[year][week])
          value += valueByYearAndWeek[year][week];

        bankHistoryData.push({
          date: date.endOf('isoWeek').format('YYYY-MM-DD'),
          value: value,
        });
        date.add(1, 'week');
      }
    }
    return bankHistoryData;
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

    brokerageFirms.forEach((brokerageFirm) => {
      brokerageFirmSummary[brokerageFirm.name] = {
        value: 0,
      };

      if (brokerageFirm.stockRecords === undefined) return;

      const stockRecordShareSummaries: BrokerageStockSummary[] =
        brokerageFirm.stockRecords.map((stockRecord) =>
          this.stockService.sumarizeBrokerageFirmStock(stockRecord),
        );

      const brokerageValue = this.stockService.summarizeBrokerageFirmValue(
        stockRecordShareSummaries,
      );
      brokerageFirmSummary[brokerageFirm.name].value += (brokerageValue *
        brokerageFirm.transactionCurrency?.exchangeRate) as number;
    });

    return brokerageFirmSummary;
  }

  @UseGuards(JwtAuthGuard)
  @Get('brokerage-firms/history-data')
  async getBrokerageFirmHistorySummary(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    const result =
      await this.userService.getUserBrokergaeFirmWithRecords(userId);
    if (result === null || result.brokerageFirms === undefined)
      throw new NotFoundException();

    const now = moment();
    let minYear = now.isoWeekYear(),
      minWeek = now.isoWeek();

    const shareNumberByYearAndWeek: {
      [year: number]: { [week: number]: { [code: string]: number } };
    } = {};
    const stockHistoryDataMap: {
      [stockCode: string]: { [year: number]: { [week: number]: number } };
    } = {};

    const initStockHistoryData = async (stock: Stock) => {
      stockHistoryDataMap[stock.code] = {};
      const stockHistoryData = await this.stockService.getStockHistory(
        stock.code,
      );
      stockHistoryData.forEach((stockHistory) => {
        const year = stockHistory.year;
        const week = stockHistory.week;
        if (!stockHistoryDataMap[stock.code][year])
          stockHistoryDataMap[stock.code][year] = {};
        if (!stockHistoryDataMap[stock.code][year][week])
          stockHistoryDataMap[stock.code][year][week] = 0;

        stockHistoryDataMap[stock.code][year][week] =
          stockHistory.close * stock.currency.exchangeRate;
      });
    };

    const addShareNumber = (
      code: string,
      year: number,
      week: number,
      shareNumber: number,
    ) => {
      if (!shareNumberByYearAndWeek[year]) shareNumberByYearAndWeek[year] = {};
      if (!shareNumberByYearAndWeek[year][week])
        shareNumberByYearAndWeek[year][week] = {};
      if (!shareNumberByYearAndWeek[year][week][code])
        shareNumberByYearAndWeek[year][week][code] = 0;

      shareNumberByYearAndWeek[year][week][code] += Number(shareNumber);
      if (year < minYear || (year === minYear && week < minWeek))
        (minYear = year), (minWeek = week);
    };

    const brokerageFirms = result.brokerageFirms;
    for (const brokerageFirm of brokerageFirms) {
      for (const stockRecord of brokerageFirm.stockRecords || []) {
        const stock = stockRecord.userStock.stock;
        if (!stockHistoryDataMap[stock.code]) await initStockHistoryData(stock);

        for (const stockBuyRecord of stockRecord.stockBuyRecords || []) {
          const date = moment(stockBuyRecord.date);
          addShareNumber(
            stock.code,
            date.year(),
            date.week(),
            stockBuyRecord.shareNumber,
          );
        }

        for (const stockSellRecord of stockRecord.stockSellRecords || []) {
          const date = moment(stockSellRecord.date);
          addShareNumber(
            stock.code,
            date.year(),
            date.week(),
            -stockSellRecord.shareNumber,
          );
        }
      }
    }

    const brokerageFirmHistoryData = [] as BrokerageFirmHistoryData[];
    const date = moment().isoWeekYear(minYear).isoWeek(minWeek);

    const stockShareNumber: { [code: string]: number } = {};
    for (let year = minYear; year <= now.year(); year++) {
      const startWeek = year === minYear ? minWeek : 1;
      const endWeek =
        year === now.year()
          ? now.isoWeek() - 1
          : moment().isoWeekYear(year).isoWeeksInYear();
      for (let week = startWeek; week <= endWeek; week++) {
        let value = 0;
        // calculate the stoch share number if it changed in certain year week.
        if (
          shareNumberByYearAndWeek[year] &&
          shareNumberByYearAndWeek[year][week]
        ) {
          Object.entries(shareNumberByYearAndWeek[year][week]).forEach(
            ([code, shareNumber]) => {
              if (!stockShareNumber[code]) stockShareNumber[code] = 0;
              stockShareNumber[code] += shareNumber;
            },
          );
        }
        // if any exception happened, the value will be 0 e.g. the stock history isn't created due to any reason.
        Object.entries(stockShareNumber).forEach(([code, shareNumber]) => {
          value += (stockHistoryDataMap[code][year]?.[week] ?? 0) * shareNumber;
        });

        brokerageFirmHistoryData.push({
          date: date.endOf('isoWeek').format('YYYY-MM-DD'),
          value: value,
        });
        date.add(1, 'week');
      }
    }
    return brokerageFirmHistoryData;
  }
}
