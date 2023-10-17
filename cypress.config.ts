import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    retries: 2,
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: false,
  screenshotOnRunFailure: false,
});
