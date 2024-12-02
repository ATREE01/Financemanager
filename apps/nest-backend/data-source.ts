import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.DB_ROOT_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.js'],
  migrations: ['./src/migrations/*.ts'],
});

export default dataSource;
