import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('TimeDepositRecords')
export class TimeDepositRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.timeDepositRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  amount: number;

  @Column()
  interestRate: string;

  @Column({
    type: 'date',
  })
  startDate: string;

  @Column({
    type: 'date',
  })
  endDate: string;

  @ManyToOne(() => Bank, (bank) => bank.timeDepositRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bank: Bank;
}
