import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import 'dotenv/config';
import { IDatabaseConfig } from '../libs/database/src';

let postgresContainer: StartedPostgreSqlContainer;

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer()
    .withEnvironment({
      POSTGRES_USER: process.env.DATABASE_USERNAME,
      POSTGRES_PASSWORD: process.env.DATABASE_PASSWORD,
      POSTGRES_DB: process.env.DATABASE_NAME,
    })
    .withExposedPorts(5432)
    .start();
});

afterAll(async () => {
  await postgresContainer.stop();
});

jest.setTimeout(60000);

const e2eDatabaseConfig = (): { database: IDatabaseConfig } => ({
  database: {
    host: postgresContainer.getHost(),
    port: postgresContainer.getMappedPort(5432),
    username: postgresContainer.getUsername(),
    password: postgresContainer.getPassword(),
    database: postgresContainer.getDatabase(),
    runMigrations: true,
  },
});

export { e2eDatabaseConfig, postgresContainer };
