import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => page.goto('/login'));
test.afterEach(async ({ page }) => page.goto('/logout'));

test('deve apresentar link para cadastro', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Cadastre-se' })).toBeVisible();
});

test('deve ser obrigatorio informar email e senha', async ({ page }) => {
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-required', 'true');
  await expect(page.getByLabel('Senha')).toHaveAttribute('aria-required', 'true');
});

test('deve aceitar senhas de no mínimo 8 caracteres', async ({ page }) => {
  await page.getByLabel('Email').fill('facoffee@ufms.br');
  await page.getByLabel('Senha').fill('1234567');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByLabel('Senha')).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Senha').fill('12345678');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByLabel('Senha')).not.toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Senha').fill('123456789');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByLabel('Senha')).not.toHaveAttribute('aria-invalid', 'true');
});

test('deve aceitar somente emails do domínio @ufms.br', async ({ page }) => {
  await page.getByLabel('Email').fill('facoffee@gmail.com');
  await page.getByLabel('Senha').fill('12345678');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
});

test('deve redirecionar para /home se o login estiver correto', async ({ page }) => {
  await page.getByLabel('Email').fill('facoffee@ufms.br');
  await page.getByLabel('Senha').fill('abc12345');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('/home');
});

test('deve redirecionar para /home se o usuário não confirmou email', async ({ page }) => {
  await page.getByLabel('Email').fill('facoffee-not-verified@ufms.br');
  await page.getByLabel('Senha').fill('abc12345');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('/verify-email*');
});

test('deve redirecionar para pagina indicada em redirectToPath', async ({ page }) => {
  await page.goto('/login?redirectToPath=/assinar');
  await page.getByLabel('Email').fill('facoffee@ufms.br');
  await page.getByLabel('Senha').fill('abc12345');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('/assinar');
});
