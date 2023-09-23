const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

module.exports = {
  dev: {
    driver: 'pg',
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT, 10),
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  },
};
