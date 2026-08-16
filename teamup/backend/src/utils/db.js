import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const mysqlOptions = {
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
};

const mysqlConnectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

// En production, utiliser une URL de connexion complète (MYSQL_URL).
// En local, utiliser la configuration détaillée host/user/password/database.
export const pool = mysqlConnectionUrl
  ? mysql.createPool(mysqlConnectionUrl, mysqlOptions)
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
