import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const mysqlOptions = {
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
};

// Railway fournit une URL complète (MYSQL_PRIVATE_URL). En local, on
// conserve la configuration détaillée host/user/password/database.
export const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL, mysqlOptions)
  : mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'teamup',
      ...mysqlOptions,
    });

export async function query(sql, params = {}) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
