import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Currency } from './entities/currency.entity';
import { UserCurrency } from './user-currency/entities/user-currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(UserCurrency)
    private readonly userCurrencyRepository: Repository<UserCurrency>,
  ) {}

  async getCurrencies(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  async createCurrency(
    code: string,
    name: string,
    exchangeRate: number,
  ): Promise<Currency> {
    return await this.currencyRepository.save(
      this.currencyRepository.create({
        code,
        name,
        exchangeRate,
      }),
    );
  }

  async getByCode(code: string): Promise<Currency | null> {
    return await this.currencyRepository.findOne({ where: { code } });
  }

  async createUserCurrency(
    userId: string,
    currencyId: number,
  ): Promise<UserCurrency> {
    return await this.userCurrencyRepository.save(
      this.userCurrencyRepository.create({
        user: { id: userId },
        currency: { id: currencyId },
      }),
    );
  }

  async getUserCurrencies(userId: string): Promise<UserCurrency[]> {
    return await this.userCurrencyRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        currency: true,
      },
    });
  }
}
