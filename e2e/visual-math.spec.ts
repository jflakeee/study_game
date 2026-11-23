import {test,expect} from '@playwright/test';

test('visual-first subtraction shows apple cores instead of strike-through',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('study-game-ui-preferences-v1',JSON.stringify({generatedMode:true,subject:'math'}));
  });
  await page.goto('/');
  await expect(page.locator('#mode')).toHaveValue('generated');
  // The generated grade-one track contains subtraction after the initial addition rows.
  // Verify the visible visual scene first, without relying on text headings.
  await expect(page.locator('.visual-math')).toBeVisible();
  await expect(page.locator('.quiz h2')).toBeHidden();
  await expect(page.locator('.visual-dot')).toHaveCount(2);
  await expect(page.locator('.visual-dot.eaten')).toHaveCount(0);
  await expect(page.locator('.visual-dot')).first().toContainText('🍎');
  await expect(page.locator('.choices .choice')).toHaveCount(3);
});
