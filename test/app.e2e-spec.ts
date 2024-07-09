import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PingResponse } from 'src/app.controller';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { e2eDatabaseConfig } from './setup.e2e';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [e2eDatabaseConfig],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    const expected: PingResponse = { ping: 'pong' };
    return request(app.getHttpServer()).get('/').expect(200).expect(expected);
  });
});
