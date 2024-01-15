import { expect, test } from '@playwright/test';

test('deve ter botão de login visivel pagina inicial', async ({ page }) => {
  await page.goto('/');

  const links = await page.getByRole('link', { name: 'Entrar' }).all();

  expect(links).toHaveLength(2);
  await Promise.all(links.map((link) => expect(link).toBeVisible()));
});
