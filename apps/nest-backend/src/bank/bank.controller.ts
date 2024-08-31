import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
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
import { BankService } from './bank.service';
import { CreateBankDto } from './dtos/create-bank.dto';
import { CreateBankRecordDto } from './dtos/create-bank-record.dto';
import { CreateTimeDepositRecordDto } from './dtos/create-time-deposit-record.dto';

@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBank(@Req() req: Request, @Body() createBankDto: CreateBankDto) {
    const userId = (req.user as UserInfo).userId;
    if (await this.bankService.getUserBankByName(userId, createBankDto.name))
      throw new ConflictException();
    return this.bankService.createBank(userId, createBankDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('records')
  async createBankRecord(
    @Req() req: Request,
    @Body() createBankRecordDto: CreateBankRecordDto,
  ) {
    try {
      await this.bankService.createBankRecord(
        (req.user as UserInfo).userId,
        createBankRecordDto,
      );
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      throw new InternalServerErrorException();
    }
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
