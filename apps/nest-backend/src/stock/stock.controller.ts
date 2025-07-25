import { UpdateStockSellRecord } from '@financemanager/financemanager-website-types';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Body,
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
import { Queue } from 'bullmq';
import { Request } from 'express';
import yahooFinance from 'yahoo-finance2';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrencyService } from '../currency/currency.service';
import { CreateStockBundleSellRecordDto } from './dtos/create-stock-bundle-sell-record.dto';
import { CreateStockBuyRecordDto } from './dtos/create-stock-buy-record.dto';
import { CreateStockRecordDto } from './dtos/create-stock-record.dto';
import { CreateStockSplitDto } from './dtos/create-stock-split.dto';
import { CreateUserStockDto } from './dtos/create-user-stock.dto';
import { UpdateStockBundleSellRecordDto } from './dtos/update-stock-bundle-sell-record.dto';
import { UpdateStockBuyRecordDto } from './dtos/update-stock-buy-record.dto';
import { UpdateStockRecordDto } from './dtos/update-stock-record.dto';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(
    @InjectQueue('StockHistory')
    private readonly stockHistoryQueue: Queue,
    private readonly stockService: StockService,
    private readonly currencyService: CurrencyService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('buy-records')
  async getStockBuyRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;
    return await this.stockService.getStockBuyRecordsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bundle-sell-records')
  async getStockBundleSellRecords(@Req() req: Request) {
    const userId = (req.user as UserInfo).userId;    
    return await this.stockService.getStockBundleSellRecordsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserStock(
    @Req() req: Request,
    @Body() createUserStockDto: CreateUserStockDto,
  ) {
    const userId = (req.user as UserInfo).userId;

    const stock = await this.stockService.checkStockCode(
      createUserStockDto.code,
    );
    if (stock === null) {
      try {
        // search for the close price first to make sure that the stock code is valid
        const now = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const data = await yahooFinance.chart(createUserStockDto.code, {
          period1: yesterday,
          period2: now,
          interval: '1mo',
        });

        const currency = await this.currencyService.getByCode(
          data.meta.currency,
        );
        const close = data.quotes[0].close;

        if (currency === null || close === null)
          throw new BadRequestException('Invalid stock code');

        const stock = await this.stockService.createStock(
          currency,
          createUserStockDto.code,
          close,
        );
        await this.stockHistoryQueue.add('createStockHistory', {
          stock: stock,
        });
        await this.stockService.createUserStock(
          userId,
          stock,
          createUserStockDto,
        );
      } catch (e) {
        console.error(e);
        throw new BadRequestException();
      }
    } else {
      try {
        await this.stockService.createUserStock(
          userId,
          stock,
          createUserStockDto,
        );
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException();
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('split')
  async createStockSplit(@Body() createStockSplit: CreateStockSplitDto) {
    const userStock = await this.stockService.getUserStockById(
      createStockSplit.userStockId,
    );

    if (userStock === null) throw new BadRequestException();
    if (createStockSplit.splitRatio < 1)
      throw new BadRequestException(
        'Split ratio must be greater than or equal to 1',
      );

    try {
      await this.stockService.splitStockRecord(
        userStock,
        createStockSplit.splitRatio,
      );
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('record')
  async createStockRecord(
    @Req() req: Request,
    @Body() createStockRecordDto: CreateStockRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    let stockRecord = await this.stockService.getStockRecord(
      userId,
      createStockRecordDto.userStockId,
      createStockRecordDto.brokerageFirmId,
      createStockRecordDto.buyPrice,
      createStockRecordDto.buyExchangeRate,
    );
    if (stockRecord === null)
      stockRecord = await this.stockService.createStockRecord(
        userId,
        createStockRecordDto,
      );
    return await this.stockService.createStockBuyRecord(
      stockRecord,
      createStockRecordDto.createStockBuyRecord as CreateStockBuyRecordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('record')
  async updateStockRecord(
    @Req() req: Request,
    @Body() updateStockRecordDto: UpdateStockRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    //check ownership

    const fromStockRecord = await this.stockService.getStockRecordById(
      updateStockRecordDto.id,
    );
    if (fromStockRecord === null) throw new BadRequestException();

    // if the result is null, then it means we need to create another record
    let toStockRecord = await this.stockService.getStockRecord(
      userId,
      updateStockRecordDto.userStockId,
      updateStockRecordDto.brokerageFirmId,
      updateStockRecordDto.buyPrice,
      updateStockRecordDto.buyExchangeRate,
    );
    if (toStockRecord === null)
      toStockRecord = await this.stockService.createStockRecord(
        userId,
        updateStockRecordDto,
      );

    // TODO: If the original stockRecord become empty after the update, consider to delete it

    await this.stockService.updateStockBuyRecord(
      toStockRecord,
      updateStockRecordDto.updateStockBuyRecord as UpdateStockBuyRecordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('record/:id')
  async deleteStockBuyRecord(@Req() req: Request, @Param('id') id: number) {
    const userId = (req.user as UserInfo).userId;
    //check ownership
    if (await this.stockService.checkStockBuyRecordOwnership(userId, id))
      return await this.stockService.deleteStockBuyRecord(id);
    throw new BadRequestException();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/bundle-sell-record')
  async createStockBundleSellRecord(
    @Req() req: Request,
    @Body() createStockBundleSellRecordDto: CreateStockBundleSellRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    try {
      const stockBundleSellRecord =
        await this.stockService.createStockBundleSellRecord(
          userId,
          createStockBundleSellRecordDto,
        );
      for (const [stockRecordId, createStockSellRecordDto] of Object.entries(
        createStockBundleSellRecordDto.createStockSellRecords,
      )) {
        const stockRecord = await this.stockService.getStockRecordById(
          Number(stockRecordId),
        );
        if (stockRecord === null) throw new BadRequestException();
        await this.stockService.createStockSellRecord(
          stockRecord,
          stockBundleSellRecord,
          createStockSellRecordDto.shareNumber,
        );
      }
      return;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/bundle-sell-records/:id')
  async updateStockBundleSellRecord(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateStockBundleSellRecordDto: UpdateStockBundleSellRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    try {
      await this.stockService.updateStockBundleSellRecord(
        userId,
        id,
        updateStockBundleSellRecordDto,
      );
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/bundle-sell-records/:id')
  async deleteStockBundleSellRecord(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    const userId = (req.user as UserInfo).userId;
    try {
      await this.stockService.deleteStockBundleSellRecord(userId, id);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/stock-sell-records/:id')
  async updateStockSellRecord(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateStockSellRecordDto: UpdateStockSellRecord,
  ) {
    try {
      await this.stockService.updateStockSellRecord(
        id,
        updateStockSellRecordDto.shareNumber,
      );
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/stock-sell-records/:id')
  async deleteStockSellRecord(@Req() req: Request, @Param('id') id: number) {
    const userId = (req.user as UserInfo).userId;
    try {
      await this.stockService.deleteStockSellRecord(userId, id);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
