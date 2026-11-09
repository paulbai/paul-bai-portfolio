import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { siteMetadataUrls, validateSiteUrl } from '../scripts/validate-site-url.mjs';

const validator = fileURLToPath(new URL('../scripts/validate-site-url.mjs', import.meta.url));

function runValidator(value, required = false) {
  const env = { ...process.env };
  if (value === undefined) delete env.PUBLIC_SITE_URL;
  else env.PUBLIC_SITE_URL = value;
  return spawnSync(process.execPath, [validator, ...(required ? ['--require'] : [])], {
    encoding: 'utf8',
    env
  });
}

test('HTTPS origins normalize to absolute canonical and social image URLs', () => {
  assert.equal(validateSiteUrl('https://portfolio.example/'), 'https://portfolio.example');
  assert.equal(validateSiteUrl('HTTPS://PORTFOLIO.EXAMPLE:443'), 'https://portfolio.example');
  assert.deepEqual(siteMetadataUrls('https://portfolio.example/'), {
    canonicalUrl: 'https://portfolio.example/',
    socialImageUrl: 'https://portfolio.example/og-v2.jpg'
  });
});

test('missing site URL is allowed locally and rejected by the deployment gate', () => {
  assert.equal(validateSiteUrl(undefined), undefined);
  assert.equal(validateSiteUrl(''), undefined);
  assert.deepEqual(siteMetadataUrls(undefined), {
    canonicalUrl: undefined,
    socialImageUrl: '/og-v2.jpg'
  });
  assert.equal(runValidator(undefined).status, 0);
  assert.equal(runValidator('https://portfolio.example/', true).status, 0);
  const missing = runValidator(undefined, true);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /PUBLIC_SITE_URL is required for deployment/);
});

test('malformed values fail in local and deployment builds', () => {
  for (const value of [
    'http://portfolio.example',
    '//portfolio.example',
    'portfolio.example',
    'https://portfolio.example/work',
    'https://portfolio.example//',
    'https://portfolio.example?',
    'https://portfolio.example/#top',
    'https://user:pass@portfolio.example',
    ' https://portfolio.example',
    'https://portfolio.example\n',
    'https://portfolio.example\\work'
  ]) {
    assert.throws(() => validateSiteUrl(value), /absolute HTTPS origin/, value);
    const result = runValidator(value);
    assert.equal(result.status, 1, value);
    assert.match(result.stderr, /absolute HTTPS origin/, value);
  }
});

function tagAttribute(html, tagName, selectorAttribute, selectorValue, valueAttribute) {
  const tag = [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'g'))]
    .map(([match]) => match)
    .find((candidate) => candidate.includes(`${selectorAttribute}="${selectorValue}"`));
  return tag?.match(new RegExp(`\\b${valueAttribute}="([^"]*)"`))?.[1];
}

test('built HTML emits consistent canonical, Open Graph, and Twitter image URLs', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const canonicalUrl = tagAttribute(html, 'link', 'rel', 'canonical', 'href');
  const ogUrl = tagAttribute(html, 'meta', 'property', 'og:url', 'content');
  const ogImage = tagAttribute(html, 'meta', 'property', 'og:image', 'content');
  const twitterImage = tagAttribute(html, 'meta', 'name', 'twitter:image', 'content');

  // npm test passes deployment environment variables through to this process.
  // A local .env file may instead be read only by Vite, so inspect the output too.
  const origin = process.env.PUBLIC_SITE_URL ?? canonicalUrl;
  const expected = siteMetadataUrls(origin);
  assert.equal(canonicalUrl, expected.canonicalUrl);
  assert.equal(ogUrl, expected.canonicalUrl);
  assert.equal(ogImage, expected.socialImageUrl);
  assert.equal(twitterImage, expected.socialImageUrl);
});
