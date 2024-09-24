import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrokerageController } from './brokerage.controller';
import { BrokerageService } from './brokerage.service';
import { BrokerageFirm } from './entities/brokerage-firm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerageFirm])],
  providers: [BrokerageService],
  controllers: [BrokerageController],
  exports: [BrokerageService],
})
export class BrokerageModule {}
