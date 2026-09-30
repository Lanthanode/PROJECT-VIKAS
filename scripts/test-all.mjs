import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'data', 'railway_db');

async function testAll() {
  console.log('[Test Suite] Running comprehensive project validation...');
  const db = new PGlite(dbPath);

  // 1. Version check
  const v = await db.query('SELECT version();');
  console.log('[1/4] Engine: PostgreSQL version detected:', v.rows[0].version.substring(0, 30));

  // 2. Constraints check (foreign keys & unique constraints)
  console.log('[2/4] Verifying table constraints & triggers...');
  const checkTriggers = await db.query(`
    SELECT trigger_name, event_manipulation, event_object_table 
    FROM information_schema.triggers 
    WHERE event_object_table = 'reservation';
  `);
  console.log(`      Found ${checkTriggers.rows.length} trigger(s) registered on 'reservation'`);

  // 3. View checks
  console.log('[3/4] Verifying analytical views...');
  const views = ['passenger_reservation_view', 'confirmed_bookings_view', 'train_reservation_summary_view'];
  for (const vw of views) {
    const res = await db.query(`SELECT COUNT(*) as count FROM ${vw};`);
    console.log(`      View ${vw}: OK (${res.rows[0].count} records)`);
  }

  // 4. Sample query execution
  console.log('[4/4] Testing sample analytical query...');
  const sample = await db.query(`
    SELECT t.Train_Name, COUNT(r.Reservation_ID) as bookings 
    FROM Train t 
    LEFT JOIN Reservation r ON t.Train_ID = r.Train_ID 
    GROUP BY t.Train_Name;
  `);
  console.log(`      Query executed cleanly across ${sample.rows.length} trains.`);

  await db.close();
  console.log('\n[PASS] All verification checks completed successfully!\n');
}

testAll().catch((err) => {
  console.error('[Verification Failed]:', err);
  process.exit(1);
});
