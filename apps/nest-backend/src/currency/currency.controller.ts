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
import { Request } from 'express';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserCurrencyDto } from '../user/dtos/create-user-currency.dto';
import { CurrencyService } from './currency.service';
import { CreateCurrencyTransactionRecordDto } from './dtos/create-currency-transaction-record.dto';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getCurrencies() {
    return this.currencyService.getCurrencies();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
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
  @Post('transaction/records')
  async createTransactionRecord(
    @Req() req: Request,
    @Body() createTransactionRecordDto: CreateCurrencyTransactionRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    return this.currencyService.createTransactionRecord(
      userId,
      createTransactionRecordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('transaction/records/:id')
  async updateTransactionRecord(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() createTransactionRecordDto: CreateCurrencyTransactionRecordDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    if (await this.currencyService.checkTransactionRecordOwnership(id, userId))
      try {
        return this.currencyService.updateTransactionRecord(
          id,
          createTransactionRecordDto,
        );
      } catch (e) {
        throw new InternalServerErrorException();
      }
    else throw new BadRequestException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('transaction/records/:id')
  async deleteTransactionRecord(@Req() req: Request, @Param('id') id: number) {
    const userId = (req.user as UserInfo).userId;
    if (await this.currencyService.checkTransactionRecordOwnership(id, userId))
      try {
        return this.currencyService.deleteTransactionRecord(id);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    else throw new BadRequestException();
  }
}
