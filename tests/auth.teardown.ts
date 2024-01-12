import { expect, test as teardown } from '@playwright/test';

teardown('logout: facoffe', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'playwright/.auth/facoffee.json' });
  const page = await context.newPage();
  await page.goto('/logout');
  await page.waitForURL('/');
});

teardown('logout: facoffe-not-verified', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'playwright/.auth/facoffee-not-verified.json' });
  const page = await context.newPage();
  await page.goto('/logout');
  await page.waitForURL('/');
});

teardown('logout: facoffe-not-admin', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'playwright/.auth/facoffee-not-admin.json' });
  const page = await context.newPage();
  await page.goto('/logout');
  await page.waitForURL('/');
});
