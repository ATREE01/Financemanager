import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBrokerageFirmDto } from './dtos/create-brokerage-firm.dto';
import { BrokerageFirm } from './entities/brokerage-firm.entity';

@Injectable()
export class BrokerageService {
  constructor(
    @InjectRepository(BrokerageFirm)
    private readonly brokerageFirmRepository: Repository<BrokerageFirm>,
  ) {}

  async getBrokerageFirmsByUserId(id: string): Promise<BrokerageFirm[]> {
    return this.brokerageFirmRepository.find({
      where: {
        user: {
          id,
        },
      },
      relations: {
        transactionCurrency: true,
        settlementCurrency: true,
      },
    });
  }

  async getuserBrokerageFirmByName(
    id: string,
    name: string,
  ): Promise<BrokerageFirm | null> {
    return this.brokerageFirmRepository.findOne({
      where: {
        user: {
          id,
        },
        name,
      },
    });
  }

  async createBrokerageFirm(
    userId: string,
    order: number,
    createBrokerageFirmDto: CreateBrokerageFirmDto,
  ): Promise<BrokerageFirm> {
    return await this.brokerageFirmRepository.save(
      this.brokerageFirmRepository.create({
        user: {
          id: userId,
        },
        name: createBrokerageFirmDto.name,
        transactionCurrency: {
          id: createBrokerageFirmDto.transactionCurrencyId,
        },
        settlementCurrency: {
          id: createBrokerageFirmDto.settlementCurrencyId,
        },
        order: order,
      }),
    );
  }

  async updateBrokerageFirm(
    id: string,
    createBrokerageFirmDto: CreateBrokerageFirmDto,
  ) {
    return await this.brokerageFirmRepository.update(id, {
      name: createBrokerageFirmDto.name,
      transactionCurrency: {
        id: createBrokerageFirmDto.transactionCurrencyId,
      },
      settlementCurrency: {
        id: createBrokerageFirmDto.settlementCurrencyId,
      },
    });
  }

  async deleteBrokerageFirm(id: string) {
    return await this.brokerageFirmRepository.delete(id);
  }

  async getCountByUserId(userId: string) {
    return this.brokerageFirmRepository.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async checkOwnership(userId: string, brokerageFirmId: string) {
    return !!(await this.brokerageFirmRepository.findOne({
      where: {
        id: brokerageFirmId,
        user: {
          id: userId,
        },
      },
    }));
  }
}
