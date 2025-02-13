import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from '@stackbox/common';
import { DatabaseModule } from '@stackbox/database';
import { ProductsModule } from '@stackbox/products';
import { WorkspacesModule } from '@stackbox/workspaces';
import { AppController } from './app.controller';

@Module({
  imports: [CommonModule, DatabaseModule, WorkspacesModule, ProductsModule],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
