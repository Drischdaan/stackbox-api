import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  port: number;
  allowedOrigins: string[];
  enableSwagger: boolean;
}

export default registerAs(
  'app',
  (): IAppConfig => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [],
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  }),
);
