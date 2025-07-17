import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
  @Get()
  async getIncExpRecords(@Req() req: Request): Promise<IncExpRecord[]> {
    const result = await this.incExpService.getIncExpRecords(
      (req.user as UserInfo).userId,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('finance')
  async getFinIncExpRecords(@Req() req: Request): Promise<IncExpRecord[]> {
    return await this.incExpService.getFinRecords(
      (req.user as UserInfo).userId,
    );
  }

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
  async udpateIncExpRecord(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateIncExpRecordDto: CreateIncExpRecordDto,
  ) {
    const yes = await this.incExpService.checkRecordOwnership(
      (req.user as UserInfo).userId,
      id,
    );
    if (!yes) {
      throw new BadRequestException();
    }
    try {
      return await this.incExpService.updateIncExpRecord(
        id,
        updateIncExpRecordDto,
      );
    } catch {
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
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
