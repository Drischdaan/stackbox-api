import {
  applyDecorators,
  INestApplication,
  Logger,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiExtraModels,
  ApiOkResponse,
  DocumentBuilder,
  getSchemaPath,
  OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  PaginationDto,
  PaginationOptionsDto,
} from './models/pagination.models';

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
      extraModels: [PaginationOptionsDto],
      operationIdFactory: (_: string, methodKey: string) => methodKey,
    },
  );

  SwaggerModule.setup('swagger', app, document);
  logger.log('📚 Swagger is enabled and running on /swagger');
}

export const ApiPaginatedOkResponse = <TClass extends Type<unknown>>(
  dto: TClass,
) =>
  applyDecorators(
    ApiExtraModels(PaginationDto, dto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(dto) },
              },
            },
          },
        ],
      },
    }),
  );
