import * as pg from 'pg';

const DB_NAME = 'crypto';
const db = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
});

// Create or replace local database and run migrations
async function main() {
  console.log('⚡️ Connected to postgres');
  await db.connect();

  await db.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
  await db.query(`CREATE DATABASE ${DB_NAME};`);
  console.log(`🌱 Created database ${DB_NAME}`);

  await db.end();
}

main();
