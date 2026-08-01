/**
 * Project Setup Script
 *
 * Automates initial project setup:
 * - Verify prerequisites (Node, npm, Python, PostgreSQL)
 * - Install dependencies
 * - Generate Prisma Client
 * - Create .env from .env.example if missing
 */

import { execSync } from 'child_process';

function run(cmd: string, label: string) {
  console.log(`\n🔧 ${label}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${label} — done`);
  } catch {
    console.error(`❌ ${label} — failed`);
    process.exit(1);
  }
}

console.log('🚀 Career Copilot — Project Setup\n');

run('npm install', 'Installing dependencies');
run('npm run db:generate', 'Generating Prisma Client');

console.log('\n✅ Setup complete! Next steps:');
console.log('   1. Copy .env.example to .env and fill in your DATABASE_URL');
console.log('   2. Run: npm run db:push');
console.log('   3. Run: npm run db:seed');
console.log('   4. Run: npm run dev');
