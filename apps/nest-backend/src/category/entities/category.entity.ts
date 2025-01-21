import { IncExpRecordType } from '@financemanager/financemanager-webiste-types';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '@/src/user/entities/user.entity';

@Entity('Categories')
@Unique(['name', 'type', 'user'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: IncExpRecordType;

  @Column()
  name: string;

  @Column({
    type: 'int',
  })
  order: number;

  @ManyToOne(() => User, (user) => user.currency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user?: User;
}
