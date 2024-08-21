import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UserInfo } from '../auth/dtos/user-info';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIncExpRecordDto } from './dtos/create-inc-exp-record.dto';
import { IncExpRecord } from './entities/inc-exp-record.entity';
import { IncExpService } from './inc-exp.service';

@Controller('inc-exp')
export class IncExpController {
  constructor(private readonly incExpService: IncExpService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createIncExpRecord(
    @Req() req: Request,
    @Body() createIncExpRecordDto: CreateIncExpRecordDto,
  ): Promise<IncExpRecord> {
    return await this.incExpService.createIncExpRecord(
      (req.user as UserInfo).userId,
      createIncExpRecordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async modifyIncExpRecord(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() modifyIncExpRecordDto: CreateIncExpRecordDto,
  ) {
    const yes = await this.incExpService.checkRecordOwnership(
      (req.user as UserInfo).userId,
      id,
    );
    if (!yes) {
      throw new BadRequestException();
    }
    try {
      return await this.incExpService.modifyIncExpRecord(
        id,
        modifyIncExpRecordDto,
      );
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRecord(@Req() req: Request, @Param('id') id: number) {
    const yes = await this.incExpService.checkRecordOwnership(
      (req.user as UserInfo).userId,
      id,
    );
    if (!yes) {
      throw new BadRequestException();
    }
    try {
      return await this.incExpService.deleteRecord(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
