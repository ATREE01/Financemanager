import {
  BadRequestException,
  Body,
  ConflictException,
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
import { BrokerageService } from './brokerage.service';
import { CreateBrokerageFirmDto } from './dtos/create-brokerage-firm.dto';

@Controller('brokerage-firms')
export class BrokerageController {
  constructor(private readonly brokerageService: BrokerageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBrokerageFirm(
    @Req() req: Request,
    @Body() createBrokerageFirmDto: CreateBrokerageFirmDto,
  ) {
    const userId = (req.user as UserInfo).userId;
    const count = await this.brokerageService.getCountByUserId(
      (req.user as UserInfo).userId,
    );

    if (
      await this.brokerageService.getuserBrokerageFirmByName(
        userId,
        createBrokerageFirmDto.name,
      )
    )
      throw new ConflictException();

    return await this.brokerageService.createBrokerageFirm(
      userId,
      count + 1,
      createBrokerageFirmDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateBrokerageFirm(
    @Req() req: Request,
    @Body() createBrokerageFirmDto: CreateBrokerageFirmDto,
    @Param('id') id: string,
  ) {
    const userId = (req.user as UserInfo).userId;
    if (await this.brokerageService.checkOwnership(userId, id)) {
      try {
        return await this.brokerageService.updateBrokerageFirm(
          userId,
          createBrokerageFirmDto,
        );
      } catch (e) {
        throw new InternalServerErrorException();
      }
    } else throw new BadRequestException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBrokerageFirm(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as UserInfo).userId;
    if (await this.brokerageService.checkOwnership(userId, id)) {
      try {
        return await this.brokerageService.deleteBrokerageFirm(id);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    } else throw new BadRequestException();
  }
}
