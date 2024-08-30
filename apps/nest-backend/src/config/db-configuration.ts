import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function dbConfig(): {
  db: TypeOrmModuleOptions;
} {
  const type = process.env.DB_TYPE;
  if (type && type !== 'mysql' && type !== 'mariadb') {
    throw new Error('Unsupported database type');
  }
  return {
    db: {
      type: type as 'mysql' | 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC
        ? process.env.DB_SYNC === 'true'
        : undefined,
    },
  };
}
