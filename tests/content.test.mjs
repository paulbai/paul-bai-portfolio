import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const forbiddenDash = /\u2014|&mdash;|&#0*8212;|&#x0*2014;|\\u2014/i;

for (const route of ['index.html']) {
  test(`${route} has no em dashes and describes Paul's web design work`, async () => {
    const html = await readFile(new URL(`../dist/${route}`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, forbiddenDash);
    const about = html.match(/<section\b[^>]*id="about(?:-b)?"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(about, 'About section exists in the rendered HTML');
    const copy = about.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    assert.match(copy, /product designer, web designer, and product manager/);
    assert.match(
      copy,
      /from focused landing pages and business websites to complex web applications/
    );
    assert.match(copy, /from the first conversation to a working product/);
    assert.match(copy, /complex engineering and infrastructure projects/);
  });
}

test('Dynamic copy and project summaries cannot reintroduce em dashes', async () => {
  async function checkDirectory(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      if (entry.isDirectory()) await checkDirectory(file);
      else if (/\.(svelte|[jt]s|css|html)$/.test(entry.name)) {
        assert.doesNotMatch(await readFile(file, 'utf8'), forbiddenDash, file.pathname);
      }
    }
  }
  await checkDirectory(new URL('../src/', import.meta.url));
});
