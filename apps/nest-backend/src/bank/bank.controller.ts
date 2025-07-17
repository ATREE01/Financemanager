import {
  BankHistoryData,
  BankRecordType,
  BankSummary,
  CurrencyTransactionRecordType,
  IncExpRecordType,
} from '@financemanager/financemanager-website-types';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import * as moment from 'moment';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrencyService } from '../currency/currency.service';
import { IncExpService } from '../inc-exp/inc-exp.service';
import { StockService } from '../stock/stock.service';
import { BankService } from './bank.service';
import { CreateBankDto } from './dtos/create-bank.dto';
import { CreateBankRecordDto } from './dtos/create-bank-record.dto';
import { CreateTimeDepositRecordDto } from './dtos/create-time-deposit-record.dto';

@Controller('banks')
export class BankController {
  constructor(
    private readonly bankService: BankService,
    private readonly incExpService: IncExpService,
    private readonly stockService: StockService,
    private readonly currencyService: CurrencyService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserBanks(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    const result = await this.bankService.getUserBanks(userId);
    if (result === null) throw new BadRequestException();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('records')
  async getUserBankRecord(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    const result = await this.bankService.getUserBankRecord(userId);
    if (result === null) throw new BadRequestException();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBank(@Req() req: Request, @Body() createBankDto: CreateBankDto) {
    const userId = (req.user as UserInfo).userId;
    const count = await this.bankService.getBankCountByUserid(userId);
    if (await this.bankService.getUserBankByName(userId, createBankDto.name))
      throw new ConflictException();
    return this.bankService.createBank(userId, count + 1, createBankDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('record')
  async createBankRecord(
    @Req() req: Request,
    @Body() createBankRecordDto: CreateBankRecordDto,
  ) {
    try {
      await this.bankService.createBankRecord(
        (req.user as UserInfo).userId,
        createBankRecordDto,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('records/:id')
  async updateBankRecord(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() createBankRecordDto: CreateBankRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    const yes = await this.bankService.checkRecordOwnership(id, userId);
    if (!yes) throw new BadRequestException();
    try {
      return await this.bankService.updateBankRecord(id, createBankRecordDto);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('records/:id')
  async deleteBankRecord(@Req() req: Request, @Param('id') id: number) {
    const userId = (req.user as UserInfo).userId;
    const yes = await this.bankService.checkRecordOwnership(id, userId);
    if (!yes) throw new BadRequestException();
    try {
      return await this.bankService.deleteBankRecord(id);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('time-deposit/records')
  async getTimeDepositRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    return await this.bankService.getTimeDepositRecordsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('time-deposit/records')
  async createTimeDepositRecord(
    @Req() req: Request,
    @Body() createTimeDepositRecordDto: CreateTimeDepositRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    try {
      return await this.bankService.createTimeDepositRecord(
        userId,
        createTimeDepositRecordDto,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('time-deposit/records/:id')
  async updateTimeDepositRecord(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() createTimeDepositRecordDto: CreateTimeDepositRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    const yes = await this.bankService.checkTimeDepositRecordOwnership(
      id,
      userId,
    );
    if (!yes) throw new BadRequestException();
    try {
      return await this.bankService.updateTimeDepositRecord(
        id,
        createTimeDepositRecordDto,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('time-deposit/records/:id')
  async deleteTimeDepositRecord(@Req() req: Request, @Param('id') id: number) {
    const userId = (req.user as UserInfo).userId;
    const yes = await this.bankService.checkTimeDepositRecordOwnership(
      id,
      userId,
    );
    if (!yes) throw new BadRequestException();
    try {
      return await this.bankService.deleteTimeDepositRecord(id);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // Add this new private helper method to your service class
  private async _getUnifiedTransactionDeltas(userId: string) {
    // 1. Fetch all data in parallel for a significant performance boost
    const [
      userBanks,
      incExpRecords,
      bankRecords,
      stockBuyRecords,
      stockBundleSellRecords,
      currencyTransactionRecords,
    ] = await Promise.all([
      this.bankService.getUserBanks(userId),
      this.incExpService.getFinRecords(userId),
      this.bankService.getUserBankRecord(userId),
      this.stockService.getStockBuyRecordsByUserId(userId),
      this.stockService.getStockBundleSellRecordsByUserId(userId),
      this.currencyService.getTransactionRecords(userId),
    ]);

    const transactions: {
      bankName: string;
      date: string | Date;
      deltaNTD: number;
    }[] = [];

    // 2. Process each type of record and convert it to a simple, unified format
    // This format includes the bank name, date, and the transaction's value in NTD.

    incExpRecords.forEach((r) => {
      if (!r.bank) return;
      const rate = r.bank.currency.exchangeRate;
      // Income is positive, Expense is negative. Charge is always a reduction.
      const value =
        (r.type === IncExpRecordType.INCOME ? r.amount : -r.amount) -
        (r.charge ?? 0);
      transactions.push({
        bankName: r.bank.name,
        date: r.date,
        deltaNTD: value * rate,
      });
    });

    bankRecords.forEach((r) => {
      const rate = r.bank.currency.exchangeRate;
      const value =
        (r.type === BankRecordType.DEPOSIT ||
        r.type === BankRecordType.TRANSFERIN
          ? Number(r.amount)
          : -Number(r.amount)) - (r.charge ?? 0);
      transactions.push({
        bankName: r.bank.name,
        date: r.date,
        deltaNTD: value * rate,
      });
    });

    stockBuyRecords.forEach((r) => {
      if (!r.bank) return;
      const rate = r.bank.currency.exchangeRate;
      transactions.push({
        bankName: r.bank.name,
        date: r.date,
        deltaNTD: -Number(r.amount) * rate,
      });
    });

    stockBundleSellRecords.forEach((r) => {
      if (!r.bank) return;
      const rate = r.bank.currency.exchangeRate;
      transactions.push({
        bankName: r.bank.name,
        date: r.date,
        deltaNTD: Number(r.amount) * rate,
      });
    });

    currencyTransactionRecords.forEach((r) => {
      if (r.type === CurrencyTransactionRecordType.COUNTER) return;
      const charge = r.charge ?? 0;

      // Outflow from the source bank
      if (r.fromBank) {
        const fromRate = r.fromBank.currency.exchangeRate;
        // CORRECTED LOGIC: The charge is subtracted from the total outflow
        const delta = -(r.fromAmount * fromRate) - charge;
        transactions.push({
          bankName: r.fromBank.name,
          date: r.date.toISOString(),
          deltaNTD: delta,
        });
      }

      // Inflow to the destination bank
      if (r.toBank) {
        const toRate = r.toBank.currency.exchangeRate;
        // The `toAmount` is the final received amount. The charge is paid by the sender.
        const delta = r.toAmount * toRate;
        transactions.push({
          bankName: r.toBank.name,
          date: r.date.toISOString(),
          deltaNTD: delta,
        });
      }
    });

    return { userBanks, transactions };
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async getBankSummary(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    // 1. Call the new helper to get all data
    const { userBanks, transactions } =
      await this._getUnifiedTransactionDeltas(userId);
    const bankSummary: BankSummary = {};

    // 2. Initialize summary object for all user banks
    userBanks.forEach((bank) => {
      bankSummary[bank.name] = { value: 0 };
    });

    // 3. Sum up the deltas for each bank in a single loop
    for (const tx of transactions) {
      if (bankSummary[tx.bankName]) {
        bankSummary[tx.bankName].value += tx.deltaNTD;
      }
    }

    return bankSummary;
  }

  @UseGuards(JwtAuthGuard)
  @Get('history-data')
  async getHistoryData(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;

    // 1. Call the new helper to get all data
    const { transactions } = await this._getUnifiedTransactionDeltas(userId);

    const now = moment();
    const valueByYearAndWeek: { [year: number]: { [week: number]: number } } =
      {};
    let minYear = now.isoWeekYear();
    let minWeek = now.isoWeek();

    // 2. Populate weekly deltas in a single, clean loop
    for (const tx of transactions) {
      const date = moment(tx.date);
      const year = date.isoWeekYear();
      const week = date.isoWeek();
      const value = tx.deltaNTD;

      if (!valueByYearAndWeek[year]) valueByYearAndWeek[year] = {};
      if (!valueByYearAndWeek[year][week]) valueByYearAndWeek[year][week] = 0;
      valueByYearAndWeek[year][week] += value;

      if (year < minYear || (year === minYear && week < minWeek)) {
        minYear = year;
        minWeek = week;
      }
    }

    // 3. The cumulative calculation logic remains the same, as it was correct.
    const bankHistoryData: BankHistoryData[] = [];
    const dateIterator = moment().isoWeekYear(minYear).isoWeek(minWeek);
    let cumulativeValue = 0;

    for (let year = minYear; year <= now.isoWeekYear(); year++) {
      const startWeek = year === minYear ? minWeek : 1;
      const endWeek =
        year === now.isoWeekYear()
          ? now.isoWeek() - 1
          : moment().isoWeekYear(year).isoWeeksInYear();

      for (let week = startWeek; week <= endWeek; week++) {
        cumulativeValue += valueByYearAndWeek[year]?.[week] ?? 0;

        bankHistoryData.push({
          date: dateIterator.endOf('isoWeek').format('YYYY-MM-DD'),
          value: cumulativeValue,
        });
        dateIterator.add(1, 'week');
      }
    }

    return bankHistoryData;
  }
}
