import assert from 'node:assert/strict';
import test from 'node:test';
import { introLayout } from '../src/lib/variant-b-layout.js';

const dimensions = (width, height, content = {}) => ({
  width,
  height,
  titleWidth: width * 0.31,
  titleHeight: width * 0.1,
  copyTop: height * 0.18,
  copyHeight: 390,
  ...content
});

test('short phones and landscape screens cannot trap introduction content', () => {
  for (const [w, h] of [
    [320, 568],
    [568, 320],
    [667, 375],
    [844, 390],
    [1024, 600]
  ])
    assert.equal(introLayout(dimensions(w, h)).flowing, true, `${w}×${h}`);
});

test('larger text falls back to document flow even on a tall viewport', () => {
  assert.equal(introLayout(dimensions(375, 812, { copyHeight: 750 })).flowing, true);
  assert.equal(introLayout(dimensions(1440, 900, { copyHeight: 900 })).flowing, true);
});

test('regular mobile and desktop retain the animated opening', () => {
  assert.equal(introLayout(dimensions(375, 812)).flowing, false);
  assert.equal(introLayout(dimensions(1440, 900)).flowing, false);
});

test('poster typography fits width and height at breakpoint and ultrawide sizes', () => {
  for (const [width, height] of [
    [320, 568],
    [375, 667],
    [768, 1024],
    [1023, 768],
    [1024, 768],
    [1440, 900],
    [1920, 1080],
    [3440, 1440]
  ]) {
    const size = dimensions(width, height);
    const { heroScale, heroY, desktop } = introLayout(size);
    assert.ok(Number.isFinite(heroScale) && heroScale > 0);
    assert.ok(size.titleWidth * heroScale <= width * (desktop ? 0.73 : 0.91) + 0.01);
    assert.ok(heroY + size.titleHeight * heroScale * 0.7 <= height * 0.86 + 0.01);
  }
});

test('orientation changes recalculate the appropriate layout', () => {
  assert.equal(introLayout(dimensions(390, 844)).flowing, false);
  assert.equal(introLayout(dimensions(844, 390)).flowing, true);
  assert.equal(introLayout(dimensions(390, 844)).flowing, false);
});
