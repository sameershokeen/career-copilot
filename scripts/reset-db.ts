/**
 * Database Reset Script
 *
 * Drops all tables, re-pushes the schema, and re-seeds.
 * ⚠️ WARNING: This destroys all data!
 */

import { execSync } from 'child_process';

console.log('⚠️  Resetting database — all data will be lost!\n');

function run(cmd: string, label: string) {
  console.log(`🔧 ${label}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${label} — done\n`);
  } catch {
    console.error(`❌ ${label} — failed`);
    process.exit(1);
  }
}

run('npm run db:push -- --force-reset', 'Force-resetting database schema');
run('npm run db:seed', 'Seeding database');

console.log('✅ Database reset complete!');
