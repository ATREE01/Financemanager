import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new NotFoundException();

    if (bcrypt.compareSync(password, user.hashedPassword)) {
      return user;
    }
    return null;
  }

  async getToken(user: { id: string; email: string; username: string }) {
    return {
      accessToken: this.jwtService.sign(user, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '60s',
      }),
      refreshToken: this.jwtService.sign(user, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '3d',
      }),
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (e) {
      return null;
    }
  }
}
