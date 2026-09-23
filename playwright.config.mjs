// this_file: playwright.config.mjs
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  workers: 1, // The preserved API corpus has a large browser search index.
  use: { baseURL: 'http://127.0.0.1:8422', viewport: { width: 1505, height: 1045 } },
  webServer: [
    { command: 'python3 -m http.server 8422 --bind 127.0.0.1 --directory dist', url: 'http://127.0.0.1:8422', reuseExistingServer: true },
    { command: 'python3 -m http.server 8423 --bind 127.0.0.1 --directory ..', url: 'http://127.0.0.1:8423', reuseExistingServer: true },
  ],
});
