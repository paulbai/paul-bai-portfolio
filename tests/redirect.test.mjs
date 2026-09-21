import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('The old comparison URL redirects to the selected homepage on static hosting', async () => {
  const html = await readFile(new URL('../dist/variant-b/index.html', import.meta.url), 'utf8');
  assert.match(html, /http-equiv="refresh"/i);
  assert.match(html, /content="0;url=\/"/);
  assert.doesNotMatch(html, /hero-cosmic|<h1|Variant A/);
});
