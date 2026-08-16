import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = await mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'teamup',
  multipleStatements: true,
});

const sql = readFileSync(new URL('../database/migration-social-messages.sql', import.meta.url), 'utf8');
await pool.query(sql);
console.log('Migration sociale appliquée.');
await pool.end();
