import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncExpRecord } from './entities/inc-exp-record.entity';
import { IncExpController } from './inc-exp.controller';
import { IncExpService } from './inc-exp.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncExpRecord])],
  providers: [IncExpService],
  controllers: [IncExpController],
  exports: [IncExpService],
})
export class IncExpModule {}
