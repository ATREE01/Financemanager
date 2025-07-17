import { IncExpMethodType } from '@financemanager/financemanager-website-types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateIncExpRecordDto } from './dtos/create-inc-exp-record.dto';
import { IncExpRecord } from './entities/inc-exp-record.entity';

@Injectable()
export class IncExpService {
  constructor(
    @InjectRepository(IncExpRecord)
    private readonly incExpRepository: Repository<IncExpRecord>,
  ) {}

  async getIncExpRecords(userId: string): Promise<IncExpRecord[]> {
    return await this.incExpRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        category: true,
        currency: true,
        bank: {
          currency: true,
        },
      },
      order: { date: 'DESC' },
    });
  }

  async getFinRecords(userId: string): Promise<IncExpRecord[]> {
    return await this.incExpRepository.find({
      where: {
        user: { id: userId },
        method: IncExpMethodType.FINANCE,
      },
      relations: {
        bank: {
          currency: true,
        },
      },
    });
  }

  async createIncExpRecord(
    userId: string,
    incExpRecordDto: CreateIncExpRecordDto,
  ): Promise<IncExpRecord> {
    return this.incExpRepository.save(
      this.incExpRepository.create({
        user: { id: userId },
        date: new Date(incExpRecordDto.date),
        type: incExpRecordDto.type,
        category: { id: incExpRecordDto.categoryId },
        currency: { id: incExpRecordDto.currencyId },
        method: incExpRecordDto.method,
        amount: incExpRecordDto.amount,
        bank: incExpRecordDto.bankId ? { id: incExpRecordDto.bankId } : null,
        charge: incExpRecordDto.charge,
        note: incExpRecordDto.note,
      }),
    );
  }

  async updateIncExpRecord(id: number, incExpRecordDto: CreateIncExpRecordDto) {
    return await this.incExpRepository.update(id, {
      date: new Date(incExpRecordDto.date),
      type: incExpRecordDto.type,
      category: { id: incExpRecordDto.categoryId },
      currency: { id: incExpRecordDto.currencyId },
      method: incExpRecordDto.method,
      amount: incExpRecordDto.amount,
      bank: incExpRecordDto.bankId ? { id: incExpRecordDto.bankId } : null,
      charge: incExpRecordDto.charge,
      note: incExpRecordDto.note,
    });
  }

  async deleteRecord(id: number) {
    return await this.incExpRepository.delete(id);
  }

  async checkRecordOwnership(userId: string, id: number): Promise<boolean> {
    const result = await this.incExpRepository.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });
    return result ? true : false;
  }
}
