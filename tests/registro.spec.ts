import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => page.goto('/registrar'));
test.afterEach(async ({ page }) => page.goto('/logout'));

test('deve apresentar link para login', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Entre' })).toBeVisible();
});

test('deve ser obrigatorio informar campos obrigatórios', async ({ page }) => {
  await expect(page.getByLabel('Nome').first()).toHaveAttribute('aria-required', 'true');
  await expect(page.getByLabel('Sobrenome').first()).toHaveAttribute('aria-required', 'true');
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-required', 'true');
  await expect(page.getByLabel('Senha').first()).toHaveAttribute('aria-required', 'true');
  await expect(page.getByLabel('Confirmar Senha').first()).toHaveAttribute('aria-required', 'true');
});

test('deve aceitar senhas de no mínimo 8 caracteres e uma letra', async ({ page }) => {
  await page.getByLabel('Nome').first().fill(faker.person.firstName());
  await page.getByLabel('Sobrenome').first().fill(faker.person.lastName());
  await page.getByLabel('Email').fill(faker.internet.email());

  await page.getByLabel('Senha').first().fill('1234567');
  await page.getByLabel('Confirmar Senha').first().fill('1234567');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Senha').first()).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Confirmar Senha').first()).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Senha').first().fill('123456a');
  await page.getByLabel('Confirmar Senha').first().fill('123456a');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Senha').first()).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Confirmar Senha').first()).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Senha').first().fill('1234567a');
  await page.getByLabel('Confirmar Senha').first().fill('1234567a');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Senha').first()).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Confirmar Senha').first()).not.toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Senha').first().fill('1234567ab');
  await page.getByLabel('Confirmar Senha').first().fill('1234567ab');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Senha').first()).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Confirmar Senha').first()).not.toHaveAttribute('aria-invalid', 'true');
});

test('deve alertar se senhas não conferem', async ({ page }) => {
  await page.getByLabel('Nome').first().fill(faker.person.firstName());
  await page.getByLabel('Sobrenome').first().fill(faker.person.lastName());
  await page.getByLabel('Email').fill(faker.internet.email());

  await page.getByLabel('Senha').first().fill('12345678');
  await page.getByLabel('Confirmar Senha').first().fill('abcdefgh');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Confirmar Senha').first()).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Senha').first().fill('1234567a');
  await page.getByLabel('Confirmar Senha').first().fill('1234567ab');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Confirmar Senha').first()).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Senha').first().fill('1234567a');
  await page.getByLabel('Confirmar Senha').first().fill('1234567a');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Senha').first()).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Confirmar Senha').first()).not.toHaveAttribute('aria-invalid', 'true');
});

test('deve aceitar somente emails do domínio @ufms.br', async ({ page }) => {
  await page.getByLabel('Nome').first().fill(faker.person.firstName());
  await page.getByLabel('Sobrenome').first().fill(faker.person.lastName());

  await page.getByLabel('Email').fill(faker.internet.email());
  await page.getByLabel('Senha').first().fill('1234567a');
  await page.getByLabel('Confirmar Senha').first().fill('1234567a');
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Email').fill(faker.internet.email({ provider: 'ufms.br' }));
  await page.getByRole('button', { name: 'Registrar' }).click();
  await expect(page.getByLabel('Email')).not.toHaveAttribute('aria-invalid', 'true');

  await page.waitForURL('/verify-email*');
});
