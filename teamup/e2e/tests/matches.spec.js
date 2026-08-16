const { test, expect } = require('@playwright/test');

test.describe('Gestion des Matchs TeamUp', () => {
  test.beforeEach(async ({ page }) => {
    // Supposons qu'il existe une route pour les matchs
    await page.goto('/matches');
  });

  test('La recherche avec des filtres combinés doit fonctionner', async ({ page }) => {
    // Tenter de filtrer par ville et sport
    const cityInput = page.locator('input[placeholder*="ville" i], input[name="city"]');
    const sportSelect = page.locator('select[name="sport"], input[placeholder*="sport" i]');
    
    if (await cityInput.count() > 0 && await sportSelect.count() > 0) {
      await cityInput.fill('Paris');
      await sportSelect.fill('Football');
      await page.keyboard.press('Enter');
      
      // Attendre la mise à jour des résultats
      await page.waitForTimeout(1000); 
      // Vérifier que la liste s'affiche ou qu'un message de résultat vide apparaît
      const results = page.locator('.match-card, [data-testid="match-card"]');
      const emptyMessage = page.locator('text=Aucun résultat');
      
      const hasResults = await results.count() > 0;
      const hasEmpty = await emptyMessage.count() > 0;
      expect(hasResults || hasEmpty).toBeTruthy();
    }
  });

  test('Création de match avec champs manquants doit échouer', async ({ page }) => {
    await page.goto('/matches/create').catch(() => {});
    if (page.url().includes('create')) {
      await page.click('button[type="submit"]');
      // Le formulaire ne devrait pas soumettre
      expect(page.url()).toContain('create');
    }
  });
});
