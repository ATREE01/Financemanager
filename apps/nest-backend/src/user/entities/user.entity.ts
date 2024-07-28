import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Profile } from '../profile/entities/profile.entity';

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
}
