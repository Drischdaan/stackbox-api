import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  port: number;
}

export default registerAs(
  'app',
  (): IAppConfig => ({
    port: parseInt(process.env.PORT, 10) || 3000,
  }),
);
