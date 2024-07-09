import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: true,
  synchronize: false,
  entities: [
    __dirname + '/../../**/*.entity.{ts,js}',
    __dirname + '/../../../src/**/*.entity.{ts,js}',
  ],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});

export default dataSource;
