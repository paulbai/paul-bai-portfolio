import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

test('The selected homepage preserves Paul’s content without variant labels', () => {
  assert.match(html, /<title>Paul Bai \| Product Designer/);
  assert.doesNotMatch(html, /href="\/variant-b\/?"|noindex/);
  assert.match(text, /I design financial products for the way Africa moves\./);
  assert.match(text, /complex engineering and infrastructure projects/);
  assert.match(text, /Financial products are trust products\./);
  assert.match(text, /Technology should earn its complexity\./);
  assert.match(text, /Design is a team sport\./);
  assert.match(text, /Product Manager · Major contributor/);
  assert.match(text, /Co-founder · WhatsApp-native money movement/);
  assert.doesNotMatch(text, /Daniel Kiss|500\+|1M\+|CSSDA/);
});

test('The portfolio keeps 21 selectable projects and accessible native dialogs', () => {
  assert.equal((html.match(/aria-label="Read a summary of /g) ?? []).length, 21);
  assert.equal((html.match(/<option /g) ?? []).length, 21);
  assert.match(html, /<dialog[^>]*aria-labelledby="b-summary-title"/);
  assert.match(html, /aria-label="Pause project rotation"/);
  assert.match(html, /aria-label="Pause motion effects"/);
  assert.match(html, /aria-label="Open navigation menu"/);
  assert.match(html, /href="https:\/\/flotme.ai"/);
  assert.match(html, /href="mailto:paulbaikanu13@gmail.com"/);
});

test('The portfolio uses the full-color NFT avatar in both photo panels', async () => {
  const portraits = [
    ...html.matchAll(/<img\b[^>]*src="\/media\/variant-b\/paul-bai-nft\.jpg"[^>]*>/g)
  ];
  assert.equal(portraits.length, 2);
  for (const [tag] of portraits) {
    assert.match(tag, /width="500"/);
    assert.match(tag, /height="500"/);
    assert.match(tag, /alt="Paul Bai’s NFT avatar:/);
  }
  assert.doesNotMatch(html, /\/media\/variant-b\/(?:profile\.png|paul-bai-4k\.jpg)/);
  const css = await readFile(new URL('../src/lib/styles/variant-b.css', import.meta.url), 'utf8');
  for (const selector of ['.b-sidebar-photo img', '.b-menu-body > img']) {
    const declarations = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
    assert.match(declarations, /filter:\s*none/);
    assert.match(declarations, /object-fit:\s*contain/);
  }
});

test('Portfolio navigation, image assets, and metadata are complete', async () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<html[^>]*lang="en"/);
  assert.match(html, /name="description"/);
  for (const key of ['og:title', 'og:description', 'og:image', 'og:type'])
    assert.ok(html.includes(`property="${key}"`));
  assert.match(html, /name="twitter:card"/);
  assert.doesNotMatch(html, /href="#"|cdn\.tailwindcss\.com/);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(html.includes(`id="${id}"`), id);
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))
    assert.match(tag, /rel="noopener noreferrer"/);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /\balt="[^"]*"/);
    assert.match(tag, /\bwidth="\d+"/);
    assert.match(tag, /\bheight="\d+"/);
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(src?.startsWith('/media/'));
    await access(new URL(`../dist${src}`, import.meta.url));
  }
});
