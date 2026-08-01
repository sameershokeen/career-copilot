/**
 * Type Generation Script
 *
 * Regenerates Prisma Client types and any derived shared types.
 */

import { execSync } from 'child_process';

console.log('🔧 Generating types...\n');

function run(cmd: string, label: string) {
  console.log(`  ${label}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`  ✅ ${label} — done\n`);
  } catch {
    console.error(`  ❌ ${label} — failed`);
    process.exit(1);
  }
}

run('npm run db:generate', 'Prisma Client generation');

console.log('✅ All types generated!');
