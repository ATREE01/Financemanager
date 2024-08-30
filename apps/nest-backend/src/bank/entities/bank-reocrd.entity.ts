import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('BankRecords')
export class BankRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bankRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  type: string;

  @Column({
    type: 'date',
  })
  date: Date;

  @ManyToOne(() => Bank, (bank) => bank.bankRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bank: Bank;

  @Column()
  amount: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  charge: number | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string | null;
}
