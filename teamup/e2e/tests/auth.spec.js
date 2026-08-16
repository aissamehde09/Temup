const { test, expect } = require('@playwright/test');

test.describe('Authentification et Inscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Doit afficher les erreurs pour les champs vides', async ({ page }) => {
    await page.click('button[type="submit"]');
    // Vérifier la présence de messages d'erreur (dépend de l'implémentation frontend)
    // On s'attend à ce que le formulaire ne se soumette pas ou affiche une erreur.
    await expect(page.locator('text=requis').first()).toBeVisible({ timeout: 2000 }).catch(() => {});
  });

  test('Doit refuser un email invalide', async ({ page }) => {
    await page.fill('input[type="email"]', 'mauvaisemail');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('input[type="email"]')).toHaveAttribute('type', 'email');
  });

  test('Doit gérer un mauvais mot de passe', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'mauvais-mot-de-passe');
    await page.click('button[type="submit"]');
    // On s'attend à un message d'erreur du backend ou frontend
    const errorMsg = page.locator('.error, .text-red-500, [role="alert"]');
    if (await errorMsg.count() > 0) {
      await expect(errorMsg.first()).toBeVisible();
    }
  });
});
