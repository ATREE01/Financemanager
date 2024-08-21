import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';
import { CategoryModule } from './category/category.module';
import { dbConfig } from './config/db-ocnfiguration';
import { CurrencyModule } from './currency/currency.module';
import { IncExpModule } from './inc-exp/inc-exp.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
