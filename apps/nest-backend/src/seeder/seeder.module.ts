import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { dbConfig } from '../config/db-configuration';
import { CurrencyModule } from '../currency/currency.module';
import { SeederService } from './seeder.service';

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
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
      },
    }),
    CurrencyModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
