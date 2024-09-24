import {
  StockRecordSummary,
  StockSummary,
  UpdateStockRecord,
} from '@financemanager/financemanager-webiste-types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import yahooFinance from 'yahoo-finance2';
import { ChartResultArray } from 'yahoo-finance2/dist/esm/src/modules/chart';
import { HistoricalHistoryResult } from 'yahoo-finance2/dist/esm/src/modules/historical';

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

  async createStock(code: string, close: number): Promise<Stock> {
    return this.stockRepository.save(
      this.stockRepository.create({
        code: code,
        close: close,
      }),
    );
  }

  async getUserStocksById(userId: string) {
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

  convertToHistoricalResult(result: ChartResultArray): HistoricalHistoryResult {
    return result.quotes
      .map((quote) => ({
        date: new Date(quote.date),
        open: quote.open || -1,
        high: quote.high || -1,
        low: quote.low || -1,
        close: quote.close || -1,
        adjClose: quote.adjClose || -1,
        volume: quote.volume || -1,
      }))
      .filter((dailyQuote) => dailyQuote.low !== -1 || dailyQuote.high !== -1);
  }

  async createStockHistory(stock: Stock) {
    const startDate = '2000-01-01';
    const now = new Date();
    const chartResult = await yahooFinance.chart(stock.code, {
      period1: startDate,
      period2: now,
      interval: '1wk',
    });
    const historyData = this.convertToHistoricalResult(chartResult);

    for (const data of historyData) {
      const date = moment(data.date);
      await this.stockHistoryRepository.save(
        this.stockHistoryRepository.create({
          stock: stock,
          date: date.toDate(),
          year: date.isoWeekYear(),
          week: date.isoWeek(),
          close: data.close,
        }),
      );
    }
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

  async getStockRecordsByUserId(userId: string): Promise<StockRecord[]> {
    return await this.stockRecordRepository.find({
      where: {
        user: {
          id: userId,
        },
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
        stockSellRecords: {
          stockBundleSellRecord: true,
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
