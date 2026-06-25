import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const distDir = resolve('dist');
const forbiddenNames = new Set([
  '.dev.vars',
  '.dev.vars.local',
  '.env',
  '.env.local',
  '.env.production',
  '.env.production.local',
]);

const removed = [];
const remaining = [];

if (existsSync(distDir)) {
  scan(distDir);
}

for (const file of removed) {
  rmSync(file, { force: true });
}

if (existsSync(distDir)) {
  findRemaining(distDir);
}

if (remaining.length > 0) {
  throw new Error(
    `Build output contains secret-bearing environment file(s): ${remaining
      .map((file) => file.replace(`${distDir}\\`, '').replace(`${distDir}/`, ''))
      .join(', ')}`
  );
}

if (removed.length > 0) {
  console.log(`Removed ${removed.length} environment file(s) from build output.`);
}

function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
      continue;
    }

    if (forbiddenNames.has(entry.name)) {
      removed.push(fullPath);
    }
  }
}

function findRemaining(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      findRemaining(fullPath);
      continue;
    }

    if (forbiddenNames.has(entry.name)) {
      remaining.push(fullPath);
    }
  }
}
