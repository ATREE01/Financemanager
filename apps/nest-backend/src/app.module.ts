import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';
import { CategoryModule } from './category/category.module';
import { dbConfig } from './config/db-configuration';
import { CurrencyModule } from './currency/currency.module';
import { IncExpModule } from './inc-exp/inc-exp.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('db');
        if (!dbConfig) {
          throw new Error('Database configuration not found');
        }
        return {
          ...dbConfig,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
    AuthModule,
    UserModule,
    BankModule,
    CurrencyModule,
    CategoryModule,
    IncExpModule,
  ],
})
export class AppModule {}
