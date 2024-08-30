import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { Currency } from './entities/currency.entity';
import { UserCurrency } from './user-currency/entities/user-currency.entity';
@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  constructor(
    private readonly confingService: ConfigService,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(UserCurrency)
    private readonly userCurrencyRepository: Repository<UserCurrency>,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    // await this.updateExchangeRate(); TODO: uncomment this line
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateExchangeRate(): Promise<void> {
    const {
      data: exchangeRates,
    }: {
      data: {
        [key: string]: {
          name: string;
          value: number;
        };
      };
    } = await firstValueFrom(
      this.httpService
        .get(
          `${this.confingService.get<string>('EXCHANGE_RATE_GOOGLE_SHEET_API')}getExchangeRate`,
        )
        .pipe(
          catchError(() => {
            this.logger.error('Error happened when getting exchange rate');
            throw 'An error happened!';
          }),
        ),
    );
    for (const key in exchangeRates) {
      await this.currencyRepository.update(
        {
          code: key,
        },
        {
          exchangeRate: exchangeRates[key]['value'],
        },
      );
    }
  }

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

  async deleteUserCurrency(id: number, userId: string): Promise<void> {
    await this.userCurrencyRepository.delete({
      user: { id: userId },
      currency: { id },
    });
  }

  async checkUserCurrencyOwnership(
    id: number,
    userId: string,
  ): Promise<boolean> {
    return !!(await this.userCurrencyRepository.findOne({
      where: {
        user: { id: userId },
        currency: { id: id },
      },
    }));
  }
}
