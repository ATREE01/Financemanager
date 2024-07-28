import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      const user = await this.userRepository.save(
        this.userRepository.create({
          hashedPassword: createUserDto.hashedPassword,
          profile: {
            username: createUserDto.username,
            email: createUserDto.email,
          },
        }),
      );
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        profile: {
          email: email,
        },
      },
    });
  }
}
