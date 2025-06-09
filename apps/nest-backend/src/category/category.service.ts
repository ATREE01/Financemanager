import { IncExpRecordType } from '@financemanager/financemanager-website-types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(category: {
    userId: string;
    type: IncExpRecordType;
    name: string;
    order: number;
  }) {
    await this.categoryRepository.save(
      this.categoryRepository.create({
        user: {
          id: category.userId,
        },
        type: category.type,
        name: category.name,
        order: category.order,
      }),
    );
  }

  async getIncomeByUserId(userId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: {
        type: IncExpRecordType.INCOME,
        user: {
          id: userId,
        },
      },
    });
  }

  async getExpenseByUserId(userId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: {
        type: IncExpRecordType.EXPENSE,
        user: {
          id: userId,
        },
      },
    });
  }

  async getCountByUserId(userId: string): Promise<number> {
    return await this.categoryRepository.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getUserCategoryByName(
    userId: string,
    name: string,
  ): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        name,
      },
    });
  }
}
