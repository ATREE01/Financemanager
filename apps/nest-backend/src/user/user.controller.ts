import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankService } from '../bank/bank.service';
import { CategoryService } from '../category/category.service';
import { CurrencyService } from '../currency/currency.service';
import { IncExpService } from '../inc-exp/inc-exp.service';
import { CreateUserCurrencyDto } from './dtos/create-user-currency.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly bankService: BankService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoryService,
    private readonly incExpRecord: IncExpService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('banks')
  async getUserBanks(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    return await this.bankService.getBankByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('currencies')
  async getUserCurrencies(@Req() req: Request) {
    const id = (req.user as UserInfo).userId;
    return await this.currencyService.getUserCurrencies(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('currencies')
  async createUserCurrency(
    @Req() req: Request,
    @Body() createUserCurrencyDto: CreateUserCurrencyDto,
  ) {
    const id = (req.user as UserInfo).userId;
    return await this.currencyService.createUserCurrency(
      id,
      createUserCurrencyDto.currencyId,
    );
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
}
