const { Pool } = require('pg');

const cfg = {
  host: process.env.DB_HOST || 'gotreferences-aurora-instance.cn2s6a0e8tmp.us-east-1.rds.amazonaws.com',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'gradmin',
  password: process.env.DB_PASSWORD || 'JaBah123JaBah123',
  database: process.env.DB_NAME || 'gotreferences',
  max: Number(process.env.DB_MAX || 10),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT || 30000),
  connectionTimeoutMillis: Number(process.env.DB_CONN_TIMEOUT || 10000),
  ssl: (process.env.DB_SSL === 'false')
    ? false
    : { rejectUnauthorized: false }
};

const pool = new Pool(cfg);

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};
