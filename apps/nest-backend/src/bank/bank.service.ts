import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBankRecordDto } from './dtos/create-bank-record.dto';
import { CreateTimeDepositRecordDto } from './dtos/create-time-deposit-record.dto';
import { Bank } from './entities/bank.entity';
import { BankRecord } from './entities/bank-reocrd.entity';
import { TimeDepositRecord } from './entities/time-deposit-record.entity';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    @InjectRepository(BankRecord)
    private readonly bankRecordRepository: Repository<BankRecord>,
    @InjectRepository(TimeDepositRecord)
    private readonly timeDepositRecordRepository: Repository<TimeDepositRecord>,
  ) {}

  async getUserBanks(userId: string): Promise<Bank[]> {
    return await this.bankRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        currency: true,
      },
    });
  }

  async getUserBankRecord(userId: string): Promise<BankRecord[]> {
    return await this.bankRecordRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        bank: {
          currency: true,
        },
      },
      order: { date: 'DESC' },
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

  async createBank(
    userId: string,
    order: number,
    bank: {
      name: string;
      currencyId: number;
    },
  ): Promise<Bank> {
    return await this.bankRepository.save(
      this.bankRepository.create({
        user: {
          id: userId,
        },
        name: bank.name,
        currency: {
          id: bank.currencyId,
        },
        order: order,
      }),
    );
  }

  async getBankCountByUserid(userId: string): Promise<number> {
    return await this.bankRepository.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createBankRecord(
    userId: string,
    createBankRecordDto: CreateBankRecordDto,
  ) {
    return await this.bankRecordRepository.save(
      this.bankRecordRepository.create({
        user: {
          id: userId,
        },
        type: createBankRecordDto.type,
        date: new Date(createBankRecordDto.date),
        bank: {
          id: createBankRecordDto.bankId,
        },
        amount: createBankRecordDto.amount,
        charge: createBankRecordDto.charge,
        note: createBankRecordDto.note,
      }),
    );
  }

  async updateBankRecord(id: number, createBankRecordDto: CreateBankRecordDto) {
    return await this.bankRecordRepository.update(id, {
      type: createBankRecordDto.type,
      date: new Date(createBankRecordDto.date),
      bank: {
        id: createBankRecordDto.bankId,
      },
      amount: createBankRecordDto.amount,
      charge: createBankRecordDto.charge,
      note: createBankRecordDto.note,
    });
  }
  async deleteBankRecord(id: number) {
    return await this.bankRecordRepository.delete(id);
  }

  async checkRecordOwnership(id: number, userId: string): Promise<boolean> {
    const result = await this.bankRecordRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    return result ? true : false;
  }

  async getTimeDepositRecordsByUserId(
    userId: string,
  ): Promise<TimeDepositRecord[]> {
    const result = await this.timeDepositRecordRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        bank: {
          currency: true,
        },
      },
    });
    return result;
  }

  async createTimeDepositRecord(
    userId: string,
    createTimeDepositRecordDto: CreateTimeDepositRecordDto,
  ): Promise<TimeDepositRecord> {
    return await this.timeDepositRecordRepository.save(
      this.timeDepositRecordRepository.create({
        name: createTimeDepositRecordDto.name,
        user: {
          id: userId,
        },
        bank: {
          id: createTimeDepositRecordDto.bankId,
        },
        amount: createTimeDepositRecordDto.amount,
        interestRate: createTimeDepositRecordDto.interestRate,
        startDate: createTimeDepositRecordDto.startDate,
        endDate: createTimeDepositRecordDto.endDate,
      }),
    );
  }

  async updateTimeDepositRecord(
    id: number,
    createTimeDepositRecordDto: CreateTimeDepositRecordDto,
  ) {
    return await this.timeDepositRecordRepository.update(id, {
      name: createTimeDepositRecordDto.name,
      amount: createTimeDepositRecordDto.amount,
      interestRate: createTimeDepositRecordDto.interestRate,
      startDate: createTimeDepositRecordDto.startDate,
      endDate: createTimeDepositRecordDto.endDate,
    });
  }

  async deleteTimeDepositRecord(id: number) {
    return await this.timeDepositRecordRepository.delete(id);
  }

  async checkTimeDepositRecordOwnership(
    id: number,
    userId: string,
  ): Promise<boolean> {
    const result = await this.timeDepositRecordRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    return result ? true : false;
  }
}
