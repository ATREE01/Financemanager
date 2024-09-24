import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Stock } from '@/src/stock/entities/stock.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('UserStock')
export class UserStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  name: string;

  @ManyToOne(() => Stock, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  stock: Stock;
}
