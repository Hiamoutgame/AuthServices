import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const dbConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: ['query', 'error', 'schema', 'warn'],
    // 2. Ép timeout sau 3 giây để bắn lỗi ra log (không bị treo vĩnh viễn):
    extra: {
      connectionTimeoutMillis: 3000,
    },
  };
  return dbConfig;
});
