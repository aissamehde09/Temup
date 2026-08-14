/**
 * One-off utility to initialize the Teamup MySQL database.
 *
 * It reads `database/schema.sql` and executes every statement against the
 * MySQL server. It prefers Railway's `MYSQL_URL` environment variable and
 * falls back to the individual `MYSQL_*` variables used locally.
 *
 * IMPORTANT: the database referenced in `schema.sql` (teamup) does not exist
 * yet the first time this runs, so we deliberately connect to the MySQL
 * *server* (no database selected) rather than to a specific database. The
 * schema file itself contains `CREATE DATABASE IF NOT EXISTS teamup` and
 * `USE teamup`, which creates/selects the database as part of the script.
 *
 * Usage:
 *   node init-db.js
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_PATH = path.join(__dirname, 'database', 'schema.sql');

// Error codes that indicate the object already exists (safe to ignore since
// the schema uses `IF NOT EXISTS` / `DROP TABLE IF EXISTS` where relevant).
const IGNORABLE_ERROR_CODES = new Set([
  'ER_TABLE_EXISTS_ERROR',
  'ER_DB_CREATE_EXISTS',
  'ER_DUP_ENTRY',
  'ER_DUP_KEYNAME',
]);

function buildConnectionConfig() {
  if (process.env.MYSQL_URL) {
    const url = new URL(process.env.MYSQL_URL);

    return {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      // Intentionally no `database` here: the target database might not
      // exist yet. schema.sql creates and selects it.
    };
  }

  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  };
}

function splitStatements(sql) {
  const withoutLineComments = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  const withoutBlockComments = withoutLineComments.replace(/\/\*[\s\S]*?\*\//g, '');

  return withoutBlockComments
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

async function initDatabase() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    throw new Error(`Schema file not found at ${SCHEMA_PATH}`);
  }

  console.log(`Reading schema from ${SCHEMA_PATH}`);
  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const statements = splitStatements(schemaSql);

  console.log(`Found ${statements.length} SQL statement(s) to execute.`);

  const config = buildConnectionConfig();
  console.log(`Connecting to MySQL at ${config.host}:${config.port} as ${config.user}...`);

  const connection = await mysql.createConnection(config);

  try {
    for (const [index, statement] of statements.entries()) {
      const preview = statement.replace(/\s+/g, ' ').slice(0, 80);

      try {
        await connection.query(statement);
        console.log(`[${index + 1}/${statements.length}] OK  - ${preview}`);
      } catch (error) {
        if (IGNORABLE_ERROR_CODES.has(error.code)) {
          console.warn(
            `[${index + 1}/${statements.length}] SKIP (already exists: ${error.code}) - ${preview}`
          );
          continue;
        }

        console.error(`[${index + 1}/${statements.length}] FAILED - ${preview}`);
        throw error;
      }
    }

    console.log('✅ Database initialized successfully.');
  } finally {
    await connection.end();
  }
}

initDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to initialize the database:', error.message || error);
    process.exit(1);
  });
