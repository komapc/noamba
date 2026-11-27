// End-to-end tests. Playwright downloads its own browser build for each of its
// versions, so a Chrome update on the CI runner cannot break them (that is what
// broke the Cypress tests these replace: Cypress 13 with the runner's Chrome 158).
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } }],
  webServer: {
    command: 'npx http-server ./src -p 8080 -c-1 -s',
    url: 'http://127.0.0.1:8080/',
    reuseExistingServer: !process.env.CI,
  },
});
