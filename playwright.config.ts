import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;
const PORT = Number(process.env.E2E_PORT || 4321);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile',
      use: { viewport: { width: 375, height: 667 } },
    },
    {
      name: 'tablet',
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'wide',
      use: { viewport: { width: 1920, height: 1080 } },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    port: PORT,
    reuseExistingServer: !CI,
    stdout: 'pipe',
  },
});
