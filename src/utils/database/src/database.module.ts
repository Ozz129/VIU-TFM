// database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import  DatabaseConfig  from '../src/config/database.config';

@Module({
  imports: [
   TypeOrmModule.forRootAsync({
    useFactory: async (configService: ConfigService) =>
    DatabaseConfig(configService),
    inject: [ConfigService],
  }),
  ],
  
})
export class DatabaseModule {}
