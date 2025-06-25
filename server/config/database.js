require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.SUPABASE_DB_URL || process.env.DB_NAME,
  process.env.SUPABASE_DB_USER || process.env.DB_USER,
  process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASS,
  {
    host: process.env.SUPABASE_DB_HOST || process.env.DB_HOST,
    port: process.env.SUPABASE_DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: false,
  }
);

module.exports = sequelize;
