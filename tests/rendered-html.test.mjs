import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const expectedProjects = [
  'Flot',
  'Mocha',
  'LightPath SDA',
  'Taskflow',
  'Attendlog',
  'Yans Fitness',
  'SS Wears',
  'Phae Task Manager',
  'Expense Tracker',
  'Voting Platform',
  'Basketball Scoreboard',
  'Calculator',
  'Passenger Counter',
  'Flot Business',
  'Flot Platform',
  'Flot Website Dashboard',
  'Belvoir Hotel',
  'Bondumani',
  'Bridges of Hope',
  'Dove Group',
  'Sierra 247'
];

test('identity, proposition, roles, and contact channels survive static rendering', () => {
  assert.match(text, /I design financial products for the way Africa moves\./);
  assert.match(text, /Shaping a connected financial ecosystem/);
  assert.match(text, /Freetown, Sierra Leone/);
  assert.match(text, /Product Manager · Major contributor/);
  assert.match(text, /Co-founder · WhatsApp-native money movement/);
  for (const url of [
    'mailto:paulbaikanu13@gmail.com',
    'https://github.com/paulbai',
    'https://www.linkedin.com/in/paul-bai-kanu-4895bb153/'
  ])
    assert.ok(html.includes(`href="${url}"`));
});

test('all 21 projects have distinct summary buttons and direct selection options', () => {
  assert.equal((html.match(/aria-label="Read a summary of /g) ?? []).length, 21);
  for (const [index, name] of expectedProjects.entries()) {
    const number = String(index + 1).padStart(2, '0');
    assert.ok(html.includes(`aria-label="Read a summary of ${name} / ${number}"`), name);
    assert.ok(html.includes(`>${name}</option>`), `Missing project picker option: ${name}`);
  }
  assert.match(html, /aria-label="Previous project"/);
  assert.match(html, /aria-label="Next project"/);
  assert.match(html, /aria-label="Pause project rotation"/);
  assert.match(html, /<dialog[^>]*aria-labelledby="b-summary-title"/);
});

test('the selected editorial design is the only homepage', () => {
  assert.match(html, /class="variant-b/);
  assert.match(html, /class="b-name/);
  assert.doesNotMatch(
    html,
    /hero-cosmic|LegacyHero|b-variant-tools|noindex|experimental portfolio/
  );
  assert.doesNotMatch(text, /Variant A|Variant B|\/ B/);
  assert.match(html, /class="b-motion-tools"/);
  assert.match(html, /id="current-work-b"/);
  assert.match(html, /id="works-b"/);
});

test('rendered local images exist and declare dimensions and alternative text', async () => {
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  assert.ok(images.length >= 24);
  for (const tag of images) {
    assert.match(tag, /\balt="[^"]*"/);
    assert.match(tag, /\bwidth="\d+"/);
    assert.match(tag, /\bheight="\d+"/);
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(src?.startsWith('/media/'), src);
    await access(new URL(`../dist${src}`, import.meta.url));
  }
  assert.ok(!html.includes('/expense-tracker.webp'), 'Never publish the old 404 screenshot');
});

test('semantic page structure and social metadata are present', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const tag of ['main', 'header', 'footer', 'nav'])
    assert.match(html, new RegExp(`<${tag}\\b`));
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && title.length < 65);
  assert.match(html, /<html[^>]*lang="en"/);
  assert.match(html, /name="description"/);
  for (const key of ['og:title', 'og:description', 'og:image', 'og:type'])
    assert.ok(html.includes(`property="${key}"`));
  assert.match(html, /name="twitter:card"/);
  assert.match(html, /rel="apple-touch-icon"/);
});

test('all local navigation anchors resolve and external links are protected', () => {
  assert.doesNotMatch(html, /href="#"/);
  for (const [_, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(html.includes(`id="${id}"`), id);
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))
    assert.match(tag, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /cdn\.tailwindcss\.com|Ayorinde|Your site is taking shape/);
});
