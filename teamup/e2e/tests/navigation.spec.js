const { test, expect } = require('@playwright/test');

test.describe('Navigation et Liens', () => {
  test('Doit charger la page d\'accueil', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/TeamUp|React/i);
  });

  test('Doit gérer les pages 404 (routes inexistantes)', async ({ page }) => {
    const response = await page.goto('/une-route-qui-nexiste-absolument-pas');
    // L'application devrait afficher une page 404 personnalisée ou un message.
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).toMatch(/(404|not found|introuvable|n'existe pas)/);
  });

  test('Tous les liens de la navbar doivent fonctionner', async ({ page }) => {
    await page.goto('/');
    const links = await page.locator('nav a, header a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        await link.click();
        await page.waitForLoadState('domcontentloaded');
        await page.goBack();
      }
    }
  });
});
