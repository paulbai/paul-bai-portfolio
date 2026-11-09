import { defineConfig } from '@playwright/test';

const previewUrl = 'http://127.0.0.1:4174';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  outputDir: '.scratch/playwright-results',
  use: {
    baseURL: previewUrl,
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_USE_CHROME === '1' ? 'chrome' : undefined,
    headless: true,
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run preview -- --port 4174 --strictPort',
    url: previewUrl,
    reuseExistingServer: false,
    timeout: 30_000,
    env: { PUBLIC_SITE_URL: 'https://paul-bai-portfolio.vercel.app' }
  }
});
