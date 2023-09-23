import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const { host, port, database, user, password } = process.env;

const client = new Pool({
  host,
  port: parseInt(port as string, 10),
  database,
  user,
  password,
});

export default client;
