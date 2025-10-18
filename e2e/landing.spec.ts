import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Your Intelligent Travel Companion')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test sign in link
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/signin');
    
    await page.goBack();
    
    // Test sign up link
    await page.getByRole('link', { name: 'Get Started' }).click();
    await expect(page).toHaveURL('/signup');
  });

  test('should display feature sections', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('AI-Powered Planning')).toBeVisible();
    await expect(page.getByText('Smart Recommendations')).toBeVisible();
    await expect(page.getByText('Real-time Assistance')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading structure
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check for proper link accessibility
    const links = page.getByRole('link');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute('href');
    }
  });
});
