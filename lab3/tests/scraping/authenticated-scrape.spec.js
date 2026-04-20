import { test, expect } from '@playwright/test';

test('authorizes, opens users page and scrapes visible data', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('anastasiia@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Workspace dashboard' })).toBeVisible();

  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

  const scrapedUsers = await page.locator('.entity-card').evaluateAll((cards) =>
    cards.map((card) => ({
      name: card.querySelector('h3')?.textContent?.trim(),
      email: card.querySelector('p')?.textContent?.trim(),
      meta: card.querySelector('small')?.textContent?.trim()
    }))
  );

  console.log('Scraped users:', JSON.stringify(scrapedUsers, null, 2));

  expect(scrapedUsers.length).toBeGreaterThan(0);
  expect(scrapedUsers[0].email).toContain('@');
});
