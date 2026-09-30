import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'data', 'railway_db');

async function initDb() {
  console.log('[Init] Ensuring database directory exists at:', dbPath);
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  const db = new PGlite(dbPath);
  console.log('[Init] PGlite instance opened successfully.');

  const schemaFile = path.join(rootDir, 'database', 'schema.sql');
  const triggersFile = path.join(rootDir, 'database', 'triggers.sql');
  const viewsFile = path.join(rootDir, 'database', 'views.sql');
  const seedFile = path.join(rootDir, 'database', 'seed.sql');

  if (fs.existsSync(schemaFile)) {
    console.log('[Init] Applying schema.sql...');
    await db.exec(fs.readFileSync(schemaFile, 'utf8'));
  }
  if (fs.existsSync(triggersFile)) {
    console.log('[Init] Applying triggers.sql...');
    await db.exec(fs.readFileSync(triggersFile, 'utf8'));
  }
  if (fs.existsSync(viewsFile)) {
    console.log('[Init] Applying views.sql...');
    await db.exec(fs.readFileSync(viewsFile, 'utf8'));
  }
  if (fs.existsSync(seedFile)) {
    console.log('[Init] Applying seed.sql...');
    try {
      await db.exec(fs.readFileSync(seedFile, 'utf8'));
    } catch (e) {
      console.log('[Init] Seed notice:', e.message);
    }
  }

  console.log('[Init] Database initialization complete!');
  await db.close();
}

initDb().catch((err) => {
  console.error('[Init Error]:', err);
  process.exit(1);
});
