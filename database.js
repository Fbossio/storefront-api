const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,

  TEST_POSTGRES_HOST,
  TEST_POSTGRES_PORT,
  TEST_POSTGRES_DB,
  TEST_POSTGRES_USER,
  TEST_POSTGRES_PASSWORD,
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
  test: {
    driver: 'pg',
    host: TEST_POSTGRES_HOST,
    port: parseInt(TEST_POSTGRES_PORT, 10),
    database: TEST_POSTGRES_DB,
    user: TEST_POSTGRES_USER,
    password: TEST_POSTGRES_PASSWORD,
  },
};
