import { defineConfig, devices } from '@playwright/test';

const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: frontendUrl,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome']
  }
});
