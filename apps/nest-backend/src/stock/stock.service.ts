import {
  BrokerageStockSummary,
  StockRecordSummary,
  StockSummary,
  UpdateStockRecord,
} from '@financemanager/financemanager-website-types';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import yahooFinance from 'yahoo-finance2';
import { ChartResultArray } from 'yahoo-finance2/dist/esm/src/modules/chart';
import { HistoricalHistoryResult } from 'yahoo-finance2/dist/esm/src/modules/historical';

import { Currency } from '../currency/entities/currency.entity';
import { CreateStockBundleSellRecordDto } from './dtos/create-stock-bundle-sell-record.dto';
import { CreateStockBuyRecordDto } from './dtos/create-stock-buy-record.dto';
import { CreateStockRecordDto } from './dtos/create-stock-record.dto';
import { CreateUserStockDto } from './dtos/create-user-stock.dto';
import { UpdateStockBundleSellRecordDto } from './dtos/update-stock-bundle-sell-record.dto';
import { UpdateStockBuyRecordDto } from './dtos/update-stock-buy-record.dto';
import { Stock } from './entities/stock.entity';
import { StockBundleSellRecord } from './entities/stock-bundle-sell-record.entity';
import { StockBuyRecord } from './entities/stock-buy-record.entity';
import { StockHistory } from './entities/stock-history.entity';
import { StockRecord } from './entities/stock-record.entity';
import { StockSellRecord } from './entities/stock-sell-reocrd.entity';
import { UserStock } from './entities/user-stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(UserStock)
    private readonly userStockRepository: Repository<UserStock>,
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(StockRecord)
    private readonly stockRecordRepository: Repository<StockRecord>,
    @InjectRepository(StockBuyRecord)
    private readonly stockBuyRecordRepository: Repository<StockBuyRecord>,
    @InjectRepository(StockSellRecord)
    private readonly stockSellRecordRepository: Repository<StockSellRecord>,
    @InjectRepository(StockBundleSellRecord)
    private readonly stockBundleSellRecordsRepository: Repository<StockBundleSellRecord>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async updateStockPriceRoutine() {
    const stocks = await this.stockRepository.find();
    for (const stock of stocks) {
      const now = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      try {
        const data = await yahooFinance.chart(stock.code, {
          period1: yesterday,
          period2: now,
          interval: '1d',
        });
        const price = data.meta.regularMarketPrice;
        if (price !== null) await this.updateStockClose(stock, price);
      } catch (error) {
        console.error(`Failed to update stock price for ${stock.code}`);
        console.error(error);
      }
    }
  }

  async onModuleInit() {
    await this.updateStockHistoryRoutine();
  }

  @Cron('0 0 * * 1')
  async updateStockHistoryRoutine() {
    const stocks = await this.stockRepository.find();
    for (const stock of stocks) {
      await this.createStockHistory(stock);
    }
  }

  async getStockByCode(code: string): Promise<Stock | null> {
    return this.stockRepository.findOne({
      where: {
        code: code,
      },
    });
  }

  async getUserStocksByUserId(userId: string) {
    return await this.userStockRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        stock: true,
      },
    });
  }

  async getUserStockById(userStockId: string): Promise<UserStock | null> {
    return await this.userStockRepository.findOne({
      where: {
        id: userStockId,
      },
    });
  }

  async getStockBuyRecordsByUserId(userId: string): Promise<StockBuyRecord[]> {
    return this.stockBuyRecordRepository.find({
      where: {
        stockRecord: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        bank: {
          currency: true,
        },
        stockRecord: {
          userStock: {
            stock: true,
          },
          brokerageFirm: true,
        },
      },
    });
  }

  async getUserStockRecordsByUserId(userId: string): Promise<StockRecord[]> {
    return await this.stockRecordRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        userStock: {
          stock: true,
        },
        brokerageFirm: true,
      },
    });
  }

  async getStockHistory(code: string): Promise<StockHistory[]> {
    return await this.stockHistoryRepository.find({
      where: {
        stock: {
          code: code,
        },
      },
    });
  }

  async createStock(
    currency: Currency,
    code: string,
    close: number,
  ): Promise<Stock> {
    return this.stockRepository.save(
      this.stockRepository.create({
        currency: currency,
        code: code,
        close: close,
      }),
    );
  }

  private async applySplitToStockSellRecord(
    stockSellRecord: StockSellRecord,
    ratio: number,
  ): Promise<void> {
    // Calculate the new sell price for the associated stock bundle sell record.
    const newSellPrice =
      stockSellRecord.stockBundleSellRecord.sellPrice / ratio;

    // Update the stock bundle sell record's sell price in the database.
    await this.stockBundleSellRecordsRepository.update(
      stockSellRecord.stockBundleSellRecord.id,
      {
        sellPrice: newSellPrice,
      },
    );

    // Calculate the new share number for the individual stock sell record.
    const newShareNumber = Math.round(stockSellRecord.shareNumber * ratio);

    // Update the stock sell record's share number in the database.
    await this.stockSellRecordRepository.update(stockSellRecord.id, {
      shareNumber: newShareNumber,
    });
  }

  private async applySplitToStockBuyRecord(
    stockBuyRecord: StockBuyRecord,
    ratio: number,
  ): Promise<void> {
    // Calculate the new share number.
    // Note: Math.round is used here as per your original code. Consider if fractional shares are possible
    // and how your system handles them (e.g., cash-in-lieu for odd lots).
    const newShareNumber = Math.round(stockBuyRecord.shareNumber * ratio);

    // Update the stock buy record's share number in the database.
    await this.stockBuyRecordRepository.update(stockBuyRecord.id, {
      shareNumber: newShareNumber,
    });
  }

  private async applySplitToIndividualStockRecord(
    stockRecord: StockRecord,
    ratio: number,
  ): Promise<void> {
    // Calculate the new buy price based on the ratio.
    const newPrice = stockRecord.buyPrice / ratio;

    // Update the stock record's buy price in the database.
    await this.stockRecordRepository.update(stockRecord.id, {
      buyPrice: newPrice,
    });

    // Iterate through all associated stock buy records and apply the split to each.
    for (const stockBuyRecord of stockRecord.stockBuyRecords) {
      await this.applySplitToStockBuyRecord(stockBuyRecord, ratio);
    }

    // Iterate through all associated stock sell records and apply the split to each.
    for (const stockSellRecord of stockRecord.stockSellRecords) {
      await this.applySplitToStockSellRecord(stockSellRecord, ratio);
    }
  }

  async splitStockRecord(userStock: UserStock, ratio: number): Promise<void> {
    try {
      const stockRecords = await this.stockRecordRepository.find({
        where: { userStock: userStock },
        relations: {
          stockBuyRecords: true,
          stockSellRecords: {
            stockBundleSellRecord: true,
          },
        },
      });

      for (const stockRecord of stockRecords) {
        await this.applySplitToIndividualStockRecord(stockRecord, ratio);
      }
    } catch (error) {
      // Log or handle any errors that occur during the process.
      // In a real application, you might want more sophisticated error reporting.
      console.error(
        `Error splitting stock records for user stock ${userStock.id}:`,
        error,
      );
      throw new Error('Failed to complete stock split operation.');
    }
  }

  convertToHistoricalResult(result: ChartResultArray): HistoricalHistoryResult {
    interface Quote {
      adjClose?: number | undefined;
      date: Date;
      high: number;
      low: number;
      open: number;
      close: number;
      volume: number;
    }
    let previousQuote: Quote | null = null;

    return result.quotes.map((quote) => {
      const date = moment(quote.date).startOf('isoWeek').toDate();

      const currentQuote = {
        date: date,
        open: quote.open ?? previousQuote?.open ?? 0,
        high: quote.high ?? previousQuote?.high ?? 0,
        low: quote.low ?? previousQuote?.low ?? 0,
        close: quote.close ?? previousQuote?.close ?? 0,
        adjClose: quote.adjclose ?? previousQuote?.adjClose ?? 0,
        volume: quote.volume ?? previousQuote?.volume ?? 0,
      };

      // Update previousQuote to the current one for the next iteration
      previousQuote = currentQuote;
      return currentQuote;
    });
  }

  async createStockHistory(stock: Stock) {
    const startDate = moment('2020-01-01').startOf('isoWeek').toDate();
    const endDate = moment().subtract(1, 'weeks').endOf('isoWeek');
    const chartResult = await yahooFinance.chart(stock.code, {
      period1: startDate,
      period2: endDate.toDate(),
      interval: '1wk',
    });
    const historyData = this.convertToHistoricalResult(chartResult);
    const operations = historyData.map(async (data) => {
      const date = moment(data.date);
      return this.stockHistoryRepository.upsert(
        {
          stock: stock,
          date: date.format('YYYY-MM-DD'),
          year: date.isoWeekYear(),
          week: date.isoWeek(),
          close: parseFloat(data.close.toFixed(6)),
        },
        {
          conflictPaths: ['stock', 'date'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
    });
    await Promise.all(operations);
  }

  async updateStockClose(stock: Stock, close: number) {
    await this.stockRepository.update(stock.id, {
      close,
    });
  }

  async checkStockCode(code: string): Promise<Stock | null> {
    return this.stockRepository.findOne({
      where: {
        code,
      },
    });
  }

  async createUserStock(
    userId: string,
    stock: Stock,
    createUserStockDto: CreateUserStockDto,
  ) {
    return await this.userStockRepository.save(
      this.userStockRepository.create({
        user: {
          id: userId,
        },
        name: createUserStockDto.name,
        stock: stock,
      }),
    );
  }

  // this function is used to get stock record for a specific user with specific buy price or other
  async getStockRecord(
    userId: string,
    userStockId: string,
    brokerageFirmId: string,
    buyPrice: number,
    buyExchangeRate: number,
  ): Promise<StockRecord | null> {
    return await this.stockRecordRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        buyPrice: buyPrice,
        buyExchangeRate: buyExchangeRate,
        brokerageFirm: {
          id: brokerageFirmId,
        },
        userStock: {
          id: userStockId,
        },
      },
    });
  }

  async getStockRecordById(stockRecordId: number): Promise<StockRecord | null> {
    return await this.stockRecordRepository.findOne({
      where: {
        id: stockRecordId,
      },
      relations: {
        user: true,
        userStock: {
          stock: true,
        },
        brokerageFirm: {
          transactionCurrency: true,
          settlementCurrency: true,
        },
        stockBuyRecords: {
          bank: true,
        },
        stockSellRecords: true,
      },
    });
  }

  summarizeStock(stockRecordSummaries: StockRecordSummary[]): StockSummary[] {
    const stockSummaryMap: Map<string, StockSummary> = new Map();
    for (const record of stockRecordSummaries) {
      const key = `${record.brokerageFirm.id}-${record.userStock.id}`;
      let summary = stockSummaryMap.get(key);
      if (!summary) {
        summary = {
          brokerageFirm: record.brokerageFirm,
          userStock: record.userStock,
          stockRecordSummaries: [],
          averageBuyPrice: 0,
          totalSoldCost: 0,
          realizedGain: 0,
          totalAmount: 0,
          totalSettlementCost: 0,
          totalTransactionCost: 0,
          totalShare: 0,
        };
        stockSummaryMap.set(key, summary);
      }
      summary.stockRecordSummaries.push(record);
      summary.totalTransactionCost += record.buyPrice * record.shareNumber;
      summary.totalSettlementCost +=
        record.buyPrice * record.shareNumber * record.buyExchangeRate;
      summary.totalAmount += record.amount;
      summary.totalSoldCost += record.totalSoldCost;
      summary.realizedGain += record.realizedGain;
      summary.totalShare += record.shareNumber;
      summary.averageBuyPrice =
        summary.totalShare !== 0
          ? summary.totalTransactionCost / summary.totalShare
          : 0;
    }
    return Array.from(stockSummaryMap.values());
  }

  summarizeStockRecord(stockRecord: StockRecord): StockRecordSummary {
    // Stock contain multiple buy record and multiple sell record
    let totalRealizedGain = 0,
      totalShareNumber = 0,
      totalAmount = 0,
      totalSoldCost = 0;
    for (const stockBuyRecord of stockRecord.stockBuyRecords) {
      totalShareNumber += Number(stockBuyRecord.shareNumber);
      totalAmount += Number(stockBuyRecord.amount); // terms of settlement
    }
    let netShareNumber = totalShareNumber;
    for (const stockSellRecord of stockRecord.stockSellRecords) {
      totalRealizedGain += Number(
        stockSellRecord.shareNumber *
          (stockSellRecord.stockBundleSellRecord.sellPrice *
            stockSellRecord.stockBundleSellRecord.sellExchangeRate -
            stockRecord.buyPrice * stockRecord.buyExchangeRate),
      );
      totalSoldCost += Number(
        stockSellRecord.shareNumber *
          stockRecord.buyPrice *
          stockRecord.buyExchangeRate,
      );
      netShareNumber -= Number(stockSellRecord.shareNumber);
    }

    return {
      id: stockRecord.id,
      user: stockRecord.user,
      brokerageFirm: stockRecord.brokerageFirm,
      userStock: stockRecord.userStock,
      buyPrice: stockRecord.buyPrice,
      buyExchangeRate: stockRecord.buyExchangeRate,

      totalSoldCost: totalSoldCost,
      realizedGain: totalRealizedGain,
      shareNumber: netShareNumber,
      amount:
        totalShareNumber === 0
          ? 0
          : Math.round((totalAmount * netShareNumber) / totalShareNumber),
    };
  }

  summarizeBrokerageFirmValue(
    brokerageStockSummaries: BrokerageStockSummary[],
  ): number {
    // this value is in term of transaction currency
    let value = 0;
    brokerageStockSummaries.forEach((stockRecord) => {
      value += stockRecord.netShareNumber * stockRecord.closePrice;
    });
    return value;
  }

  sumarizeBrokerageFirmStock(stockRecord: StockRecord): BrokerageStockSummary {
    let netShareNumber = 0;
    stockRecord.stockBuyRecords.forEach((stockBuyRecord) => {
      netShareNumber += Number(stockBuyRecord.shareNumber);
    });
    stockRecord.stockSellRecords.forEach((stockSellRecord) => {
      netShareNumber -= Number(stockSellRecord.shareNumber);
    });
    return {
      brokerageFirm: stockRecord.brokerageFirm,
      stockCode: stockRecord.userStock.stock.code,
      closePrice: stockRecord.userStock.stock.close,
      netShareNumber: netShareNumber,
    };
  }

  async createStockRecord(
    userId: string,
    createStockRecordDto: CreateStockRecordDto,
  ): Promise<StockRecord> {
    return await this.stockRecordRepository.save(
      this.stockRecordRepository.create({
        user: {
          id: userId,
        },
        brokerageFirm: {
          id: createStockRecordDto.brokerageFirmId,
        },
        userStock: {
          id: createStockRecordDto.userStockId,
        },
        buyPrice: createStockRecordDto.buyPrice,
        buyExchangeRate: createStockRecordDto.buyExchangeRate,
      }),
    );
  }

  async updateStockRecord(updateStockRecordDto: UpdateStockRecord) {
    await this.stockRecordRepository.update(updateStockRecordDto.id, {
      brokerageFirm: {
        id: updateStockRecordDto.brokerageFirmId,
      },
      userStock: {
        id: updateStockRecordDto.userStockId,
      },
      buyPrice: updateStockRecordDto.buyPrice,
      buyExchangeRate: updateStockRecordDto.buyExchangeRate,
    });
  }

  async deleteStockRecord(stockRecordId: number) {
    await this.stockRecordRepository.delete(stockRecordId);
  }

  async createStockBuyRecord(
    stockRecord: StockRecord,
    createStockBuyRecordDto: CreateStockBuyRecordDto,
  ) {
    await this.stockBuyRecordRepository.save(
      this.stockBuyRecordRepository.create({
        stockRecord: stockRecord,
        bank: {
          id: createStockBuyRecordDto.bankId,
        },
        date: createStockBuyRecordDto.date,
        buyMethod: createStockBuyRecordDto.buyMethod,
        shareNumber: createStockBuyRecordDto.shareNumber,
        charge: createStockBuyRecordDto.charge,
        amount: createStockBuyRecordDto.amount,
        note: createStockBuyRecordDto.note,
      }),
    );
  }

  async updateStockBuyRecord(
    stockRecord: StockRecord,
    updateStockBuyRecord: UpdateStockBuyRecordDto,
  ) {
    await this.stockBuyRecordRepository.update(updateStockBuyRecord.id, {
      stockRecord: stockRecord, // change the owner of this buy record
      bank: {
        id: updateStockBuyRecord.bankId,
      },
      date: updateStockBuyRecord.date,
      buyMethod: updateStockBuyRecord.buyMethod,
      shareNumber: updateStockBuyRecord.shareNumber,
      charge: updateStockBuyRecord.charge,
      amount: updateStockBuyRecord.amount,
      note: updateStockBuyRecord.note,
    });
  }

  async deleteStockBuyRecord(stockBuyRecordId: number) {
    await this.stockBuyRecordRepository.delete({
      id: stockBuyRecordId,
    });
  }

  async checkStockBuyRecordOwnership(
    userId: string,
    stockBuyRecordId: number,
  ): Promise<boolean> {
    const result = await this.stockRecordRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        stockBuyRecords: {
          id: stockBuyRecordId,
        },
      },
    });
    return result !== null;
  }

  async getStockBundleSellRecordsByUserId(
    userId: string,
  ): Promise<StockBundleSellRecord[]> {
    return this.stockBundleSellRecordsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        bank: {
          currency: true,
        },
        brokerageFirm: true,
        userStock: true,
        stockSellRecords: true,
      },
    });
  }

  async createStockBundleSellRecord(
    userId: string,
    createStockBundleSellRecordDto: CreateStockBundleSellRecordDto,
  ) {
    return await this.stockBundleSellRecordsRepository.save(
      this.stockBundleSellRecordsRepository.create({
        user: {
          id: userId,
        },
        date: createStockBundleSellRecordDto.date,
        bank: {
          id: createStockBundleSellRecordDto.bankId,
        },
        brokerageFirm: {
          id: createStockBundleSellRecordDto.brokerageFirmId,
        },
        userStock: {
          id: createStockBundleSellRecordDto.userStockId,
        },
        sellPrice: createStockBundleSellRecordDto.sellPrice,
        sellExchangeRate: createStockBundleSellRecordDto.sellExchangeRate,
        charge: createStockBundleSellRecordDto.charge,
        tax: createStockBundleSellRecordDto.tax,
        amount: createStockBundleSellRecordDto.amount,
        note: createStockBundleSellRecordDto.note,
      }),
    );
  }

  async createStockSellRecord(
    stockRecord: StockRecord,
    stockBundleSellRecord: StockBundleSellRecord,
    shareNumber: number,
  ) {
    await this.stockSellRecordRepository.save(
      this.stockSellRecordRepository.create({
        date: stockBundleSellRecord.date,
        stockBundleSellRecord: stockBundleSellRecord,
        stockRecord: stockRecord,
        shareNumber: shareNumber,
      }),
    );
  }

  async updateStockBundleSellRecord(
    userId: string,
    id: number,
    updateStockBundleSellRecordDto: UpdateStockBundleSellRecordDto,
  ) {
    await this.stockBundleSellRecordsRepository.update(
      {
        id: id,
        user: {
          id: userId,
        },
      },
      {
        date: updateStockBundleSellRecordDto.date,
        bank: {
          id: updateStockBundleSellRecordDto.bankId,
        },
        stockSellRecords: (
          await this.stockSellRecordRepository.find({
            where: { stockBundleSellRecord: { id: id } },
          })
        ).map((stockSellRecord) => ({
          ...stockSellRecord,
          date: updateStockBundleSellRecordDto.date,
        })),
        sellPrice: updateStockBundleSellRecordDto.sellPrice,
        sellExchangeRate: updateStockBundleSellRecordDto.sellExchangeRate,
        charge: updateStockBundleSellRecordDto.charge,
        tax: updateStockBundleSellRecordDto.tax,
        amount: updateStockBundleSellRecordDto.amount,
        note: updateStockBundleSellRecordDto.note,
      },
    );
  }

  async updateStockSellRecord(id: number, shareNumber: number) {
    await this.stockSellRecordRepository.update(
      {
        id: id,
      },
      {
        shareNumber: shareNumber,
      },
    );
  }

  async deleteStockBundleSellRecord(
    userId: string,
    stockBundleSellRecordId: number,
  ) {
    await this.stockBundleSellRecordsRepository.delete({
      user: {
        id: userId,
      },
      id: stockBundleSellRecordId,
    });
  }

  async deleteStockSellRecord(userId: string, id: number) {
    await this.stockSellRecordRepository.delete({
      stockBundleSellRecord: {
        user: {
          id: userId,
        },
      },
      id: id,
    });
  }
}
