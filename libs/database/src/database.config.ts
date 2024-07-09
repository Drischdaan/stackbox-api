import { registerAs } from '@nestjs/config';

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  runMigrations: boolean;
}

export default registerAs(
  'database',
  (): IDatabaseConfig => ({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    runMigrations: process.env.DATABASE_MIGRATIONS === 'true',
  }),
);
