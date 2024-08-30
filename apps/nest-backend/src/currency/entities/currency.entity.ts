import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { UserCurrency } from '@/src/currency/user-currency/entities/user-currency.entity';
import { IncExpRecord } from '@/src/inc-exp/entities/inc-exp-record.entity';

@Entity('Currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({
    type: 'float',
  })
  exchangeRate: number;

  @OneToMany(() => UserCurrency, (userCurrnecy) => userCurrnecy.currency)
  userCurrency: UserCurrency[];

  @OneToMany(() => IncExpRecord, (incExpRecord) => incExpRecord.currency)
  incExpRecords?: IncExpRecord[];

  @OneToMany(() => Bank, (bank) => bank.currency)
  bank?: Bank[];
}
