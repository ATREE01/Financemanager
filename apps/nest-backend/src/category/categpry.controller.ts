import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.getUserCategoryByName(
      createCategoryDto.userId,
      createCategoryDto.name,
    );

    if (category) {
      throw new ConflictException();
    }

    const count = await this.categoryService.getCountByUserId(
      createCategoryDto.userId,
    );
    return this.categoryService.create({
      ...createCategoryDto,
      order: count + 1,
    });
  }
}
