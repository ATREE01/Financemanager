import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { BankRecord } from '@/src/bank/entities/bank-reocrd.entity';
import { TimeDepositRecord } from '@/src/bank/entities/time-deposit-record.entity';
import { Category } from '@/src/category/entities/category.entity';
import { UserCurrency } from '@/src/currency/user-currency/entities/user-currency.entity';
import { IncExpRecord } from '@/src/inc-exp/entities/inc-exp-record.entity';
import { Profile } from '@/src/user/profile/entities/profile.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hashedPassword: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  profile: Profile;

  @OneToMany(() => Bank, (bank) => bank.user)
  bank?: Bank[];

  @OneToMany(() => UserCurrency, (userCurrency) => userCurrency.user)
  currency?: UserCurrency[];

  @OneToMany(() => Category, (category) => category.user)
  category?: Category[];

  @OneToMany(() => IncExpRecord, (incExpRecord) => incExpRecord.user)
  incExpRecords?: IncExpRecord[];

  @OneToMany(() => BankRecord, (bankRecord) => bankRecord.user)
  bankRecords?: BankRecord[];

  @OneToMany(
    () => TimeDepositRecord,
    (timeDepositRecord) => timeDepositRecord.user,
  )
  timeDepositRecords?: TimeDepositRecord[];
}
