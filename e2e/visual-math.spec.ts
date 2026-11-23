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

test('visual-first subtraction shows eaten apple cores and countable remaining apples',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('study-game-ui-preferences-v1',JSON.stringify({generatedMode:true,subject:'math'}));
    localStorage.setItem('study-game-generated-progress-v1',JSON.stringify({
      version:1,tracks:{'1:math':{position:800,offset:0}}
    }));
  });
  await page.goto('/');
  await expect(page.locator('#mode')).toHaveValue('generated');
  await expect(page.locator('.visual-math')).toBeVisible();
  await expect(page.locator('.quiz h2')).toHaveClass(/visually-hidden/);
  await expect(page.locator('.quiz h2')).toHaveText('2 - 1 = ?');
  await expect(page.locator('.visual-dot')).toHaveCount(2);
  await expect(page.locator('.visual-dot.eaten')).toHaveCount(1);
  await expect(page.locator('.visual-dot.eaten svg')).toHaveCount(1);
  await expect(page.locator('.visual-dot:not(.eaten)')).toHaveCount(1);
  await expect(page.locator('.visual-math')).not.toContainText('−');
});
