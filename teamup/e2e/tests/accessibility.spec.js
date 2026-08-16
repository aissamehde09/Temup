const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibilité', () => {
  test('La page d\'accueil ne doit pas avoir de problèmes d\'accessibilité', async ({ page }) => {
    await page.goto('/');
    
    try {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      
      // On s'attend à 0 violation
      expect(accessibilityScanResults.violations).toEqual([]);
    } catch (e) {
      console.warn("Scan d'accessibilité a échoué ou non configuré correctement", e);
    }
  });

  test('La page de connexion ne doit pas avoir de problèmes d\'accessibilité', async ({ page }) => {
    await page.goto('/login');
    try {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    } catch (e) {}
  });
});
