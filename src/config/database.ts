import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const { NODE_ENV } = process.env;
let dbConfig;

switch (NODE_ENV) {
  case 'test':
    dbConfig = {
      host: process.env.TEST_POSTGRES_HOST,
      port: parseInt(process.env.TEST_POSTGRES_PORT as string, 10),
      database: process.env.TEST_POSTGRES_DB,
      user: process.env.TEST_POSTGRES_USER,
      password: process.env.TEST_POSTGRES_PASSWORD,
    };
    break;

  case 'dev':
    dbConfig = {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT as string, 10),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    };
    break;

  default: // development
    dbConfig = {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT as string, 10),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    };
    break;
}

const client = new Pool(dbConfig);

export default client;
