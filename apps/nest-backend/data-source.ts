import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

console.log('db_name:', process.env.DB_NAME);

const dataSource = new DataSource({
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'nest-backend',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['**/*.entity.js'],
  migrations: ['./src/migrations/*.ts'],
});

export default dataSource;
