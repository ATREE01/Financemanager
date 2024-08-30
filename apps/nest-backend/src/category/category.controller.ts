import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(
    @Req() req: Request,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    const category = await this.categoryService.getUserCategoryByName(
      userId,
      createCategoryDto.name,
    );

    if (category) {
      throw new ConflictException();
    }

    const count = await this.categoryService.getCountByUserId(userId);
    return this.categoryService.create({
      userId,
      ...createCategoryDto,
      order: count + 1,
    });
  }
}
