import {test,expect} from '@playwright/test';

test('visual-first addition displays countable apples without visible question sentence',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('study-game-ui-preferences-v1',JSON.stringify({generatedMode:true,subject:'math'}));
  });
  await page.goto('/');
  await expect(page.locator('#mode')).toHaveValue('generated');
  // Check the first generated grade-one addition scene without relying on visible text.
  await expect(page.locator('.visual-math')).toBeVisible();
  await expect(page.locator('.quiz h2')).toHaveClass(/visually-hidden/);
  await expect(page.locator('.visual-dot')).toHaveCount(2);
  await expect(page.locator('.visual-dot.eaten')).toHaveCount(0);
  await expect(page.locator('.visual-dot').first()).toContainText('🍎');
  await expect(page.locator('.choices .choice')).toHaveCount(3);
});
