import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('The static release excludes legacy hosting and database artifacts', async () => {
  for (const path of ['.openai', '.env.local', 'db', 'drizzle', '.scratch']) {
    await assert.rejects(access(new URL(`../dist/${path}`, import.meta.url)));
  }
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.buildCommand, 'npm run check && npm test');
  assert.ok(
    config.redirects.some(
      (rule) => rule.source === '/variant-b' && rule.destination === '/' && rule.permanent
    )
  );
});
