import { CreateTimeDepositRecord } from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateTimeDepositRecordDto implements CreateTimeDepositRecord {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  name: string;

  @ApiProperty()
  @IsString()
  bankId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  interestRate: string;

  @ApiProperty()
  @IsString()
  startDate: string;

  @ApiProperty()
  @IsString()
  endDate: string;
}
