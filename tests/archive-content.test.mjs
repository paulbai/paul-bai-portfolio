import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { projects } from '../src/lib/data/projects.ts';

test('archive cards keep visitors on the portfolio while product links remain available', async () => {
  assert.equal(projects.length, 21);
  assert.equal(projects[0].website?.href, 'https://flotme.ai');
  assert.equal(projects[1].website?.href, 'https://getmocha.io');

  for (const project of projects.slice(2)) {
    assert.ok(
      !project.website || !/^https?:\/\/(?:www\.)?github\.com(?:\/|$)/i.test(project.website.href),
      `${project.title} should not send visitors to a GitHub repository`
    );
  }

  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const dialog = html.match(/<dialog\b[^>]*class="b-project-dialog"[\s\S]*?<\/dialog>/)?.[0];
  assert.ok(dialog, 'Project summary dialog is rendered');
  assert.doesNotMatch(dialog, /href="https?:\/\/(?:www\.)?github\.com\//i);
  assert.match(dialog, /href="https:\/\/flotme\.ai"/);
});

test('empty archive repositories are presented as concepts, not shipped products', () => {
  for (const number of ['06', '10']) {
    const project = projects.find((item) => item.number === number);
    assert.ok(project, `Project ${number} exists`);
    assert.match(`${project.phase} ${project.kind}`, /concept|early/i, project.title);
    assert.match(
      project.summary,
      /no (?:application )?(?:code|implementation|project documentation)/i,
      `${project.title} should disclose the absence of a documented implementation`
    );
    assert.equal(project.website, undefined, `${project.title} has no implementation link`);
  }
});
