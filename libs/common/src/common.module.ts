import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import appConfig from './app.config';
import { TypeormFilter } from './filters/typeorm.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeormFilter,
    },
  ],
})
export class CommonModule {}
