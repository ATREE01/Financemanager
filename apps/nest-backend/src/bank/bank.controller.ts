import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankService } from './bank.service';
import { CreateBankDto } from './dtos/create-bank.dto';

@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBank(@Body() createBankDto: CreateBankDto) {
    if (
      await this.bankService.getUserBankByName(
        createBankDto.userId,
        createBankDto.name,
      )
    )
      throw new ConflictException();
    return this.bankService.createBank(createBankDto);
  }
}
