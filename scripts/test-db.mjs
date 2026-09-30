import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'data', 'railway_db');

async function testDb() {
  console.log('[Test] Opening database at:', dbPath);
  const db = new PGlite(dbPath);

  const v = await db.query('SELECT version();');
  console.log('PostgreSQL version:', v.rows[0].version);

  const tables = ['passenger', 'train', 'station', 'payment', 'reservation', 'train_station', 'reservation_audit'];
  for (const t of tables) {
    const res = await db.query(`SELECT COUNT(*) as count FROM ${t};`);
    console.log(`Table ${t}: ${res.rows[0].count} records`);
  }

  const viewRes = await db.query('SELECT * FROM Passenger_Reservation_View LIMIT 3;');
  console.log('View output check (rows returned):', viewRes.rows.length);

  await db.close();
  console.log('[Test] All database checks passed successfully!');
}

testDb().catch((err) => {
  console.error('[Test Error]:', err);
  process.exit(1);
});
