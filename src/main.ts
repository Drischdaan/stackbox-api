import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IAppConfig, useSwagger } from '@stackbox/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const appConfig: IAppConfig = configService.get<IAppConfig>('app');

  app.enableCors({
    origin: appConfig.allowedOrigins,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (appConfig.enableSwagger) useSwagger(app);

  await app.listen(appConfig.port);
  logger.log(`🚀 Application is running on port ${appConfig.port}`);
}
bootstrap();
