import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from '@stackbox/common';
import { DatabaseModule } from '@stackbox/database';
import { AppController } from './app.controller';

@Module({
  imports: [CommonModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
