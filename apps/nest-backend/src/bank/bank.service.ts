import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bank } from './entities/bank.entity';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async createBank(bank: {
    userId: string;
    name: string;
    currencyId: number;
  }): Promise<Bank> {
    return await this.bankRepository.save(
      this.bankRepository.create({
        user: {
          id: bank.userId,
        },
        name: bank.name,
        currency: {
          id: bank.currencyId,
        },
      }),
    );
  }

  async getByUserId(userId: string): Promise<Bank[]> {
    return await this.bankRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['currency'],
    });
  }

  async getUserBankByName(userId: string, name: string): Promise<Bank | null> {
    return await this.bankRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        name,
      },
    });
  }
}
