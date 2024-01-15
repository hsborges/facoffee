import { expect, test as setup } from '@playwright/test';

setup('login: facoffe', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/login');
  await page.getByLabel('Email').fill('facoffee@ufms.br');
  await page.getByLabel('Senha').fill('abc12345');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('/home');
  // End of authentication steps.
  await page.context().storageState({ path: 'playwright/.auth/facoffee.json' });
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
});

setup('login: facoffe-not-verified', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/login');
  await page.getByLabel('Email').fill('facoffee-not-verified@ufms.br');
  await page.getByLabel('Senha').fill('abc12345');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('/verify-email*');
  // End of authentication steps.
  await page.context().storageState({ path: 'playwright/.auth/facoffee-not-verified.json' });
});

setup('login: facoffe-not-admin', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/login');
  await page.getByLabel('Email').fill('facoffee-not-admin@ufms.br');
  await page.getByLabel('Senha').fill('abc12345');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('/home');
  // End of authentication steps.
  await page.context().storageState({ path: 'playwright/.auth/facoffee-not-admin.json' });
  await expect(page.getByRole('link', { name: 'Admin' })).not.toBeVisible();
});
