import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: 'playwright/.auth/facoffee-not-admin.json' });

test.beforeEach(async ({ page }) => page.goto('/home'));

test('deve apresentar link para assinatura', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Assinar' })).toBeVisible();
});

test('deve apresentar planos e valores ao iniciar processo', async ({ page }) => {
  await page.getByRole('link', { name: 'Assinar' }).click();

  await expect(page.getByText('Café BRONZE').locator('..').locator('..').getByText('R$ 10,00')).toBeVisible();
  await expect(page.getByText('Café PRATA').locator('..').locator('..').getByText('R$ 20,00')).toBeVisible();
  await expect(page.getByText('Café OURO').locator('..').locator('..').getByText('R$ 30,00')).toBeVisible();
});

test('deve selecionar o período somente após selecionar o plano', async ({ page }) => {
  await page.getByRole('link', { name: 'Assinar' }).click();
  await page.getByText('Selecione o período').first().click();
  await expect(page.getByRole('textbox')).not.toBeVisible();
});

test('deve apresentar opções de período após selecionar o plano', async ({ page }) => {
  await page.getByRole('link', { name: 'Assinar' }).click();
  await page.getByText('Selecionar').first().click();
  await expect(page.getByRole('combobox')).toBeVisible();
});

test('deve permitir voltar na escolha após a seleção do plano', async ({ page }) => {
  await page.getByRole('link', { name: 'Assinar' }).click();
  await page.getByText('Selecionar').first().click();
  await expect(page.getByRole('combobox')).toBeVisible();
  await page.getByText('Selecione o plano').first().click();
  await expect(page.getByText('R$ 10,00')).toBeVisible();
});

test('deve apresentar resumo após selecionar plano e período', async ({ page }) => {
  await page.getByRole('link', { name: 'Assinar' }).click();
  await page.getByText('Selecionar').first().click();
  await expect(page.getByRole('combobox')).toBeVisible();

  await page.getByRole('combobox').selectOption('2');
  await page.getByText('Próximo').click();

  await expect(page.getByText('Café BRONZE').last()).toBeVisible();
  await expect(page.getByText('2 meses').last()).toBeVisible();
});

test('deve redirecionar para página inicial ao assinar plano', async ({ page }) => {
  await page.getByRole('link', { name: 'Assinar' }).click();
  await page.getByText('Selecionar').first().click();
  await expect(page.getByRole('combobox')).toBeVisible();

  await page.getByRole('combobox').selectOption('2');
  await page.getByText('Próximo').click();
  await page.getByText('Confirmar').click();

  await page.waitForURL('/home');
});

test('deve apresentar resumo na página inicial após assinatura', async ({ page }) => {
  await expect(page.getByText('Café BRONZE')).toBeVisible();
  await expect(page.getByText('Cancelar assinatura')).toBeVisible();
});

test('deve apresentar modal de confirmação e pedir código para cancelar assinatura', async ({ page }) => {
  await page.getByText('Cancelar assinatura').click();
  await expect(page.getByText('Confirmar ação')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar' })).toBeDisabled();

  await page.getByRole('textbox').fill('CONFIRMAR');
  await expect(page.getByRole('button', { name: 'Confirmar' })).toBeDisabled();

  await page.getByRole('textbox').fill('CANCELAR');
  await expect(page.getByRole('button', { name: 'Confirmar' })).toBeEnabled();

  await page.getByRole('button', { name: 'Confirmar' }).click();

  await page.waitForURL('/home');
  await expect(page.getByRole('link', { name: 'Assinar' })).toBeVisible();
});
