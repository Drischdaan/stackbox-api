import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function useSwagger(app: INestApplication) {
  const logger: Logger = new Logger('Bootstrap');
  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  const builder: DocumentBuilder = new DocumentBuilder();
  builder.setTitle(configService.get<string>('npm_package_name'));
  builder.setDescription(configService.get<string>('npm_package_description'));
  builder.setVersion(configService.get<string>('npm_package_version'));

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    builder.build(),
    {
      operationIdFactory: (_: string, methodKey: string) => methodKey,
    },
  );

  SwaggerModule.setup('swagger', app, document);
  logger.log('📚 Swagger is enabled and running on /swagger');
}
