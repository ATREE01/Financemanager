import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { CurrencyService } from '../currency/currency.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly currencyService: CurrencyService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    if ((await this.userService.getUserByEmail(registerDto.email)) !== null) {
      throw new ConflictException();
    }

    const hashedPassword = bcrypt.hashSync(registerDto.password, 12);

    const user = await this.userService.createUser({
      username: registerDto.username,
      email: registerDto.email,
      hashedPassword: hashedPassword,
    });

    // when a user is registered, create the default user currency

    const currency = await this.currencyService.getByCode('TWD');
    if (!currency) throw new NotFoundException('Currency not found');
    await this.currencyService.createUserCurrency(user.id, currency.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.getToken({
      id: (req.user as User).id,
      email: (req.user as User).profile.email,
      username: (req.user as User).profile.username,
    });

    const { hashedPassword, ...user } = req.user as User;

    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      user: user,
      accessToken: tokens.accessToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Logout successful' });
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['jwt'];
    if (refreshToken === undefined) throw new ForbiddenException();

    const payload: {
      id: string;
      email: string;
      username: string;
      iat: number;
      exp: number;
    } = await this.authService.verifyRefreshToken(refreshToken);
    if (payload === null) throw new UnauthorizedException();

    const oriUser = await this.userService.getUserByEmail(payload.email);
    if (!oriUser) throw new NotFoundException();

    const { hashedPassword, ...user } = oriUser;

    const tokens = await this.authService.getToken({
      id: user.id,
      email: user.profile.email,
      username: user.profile.username,
    });

    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      user: user,
      accessToken: tokens.accessToken,
    });
  }
}
