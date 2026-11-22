import {test,expect} from '@playwright/test';

test('generated mode: answer, reload and switch subjects without losing progress',async({page})=>{
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  const first=await page.locator('.quiz h2').innerText();
  await page.locator('[data-answer]').first().click();
  await expect(page.locator('.progress')).toContainText('1 / 1200');
  const second=await page.locator('.quiz h2').innerText();
  expect(second).not.toBe(first);
  await page.reload();
  await page.locator('#mode').selectOption('generated');
  await expect(page.locator('.quiz h2')).toHaveText(second);
  await page.locator('#subject').selectOption('korean');
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await page.locator('#subject').selectOption('math');
  await expect(page.locator('.quiz h2')).toHaveText(second);
  await page.locator('#grade').selectOption('2');
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await page.locator('#grade').selectOption('1');
  await expect(page.locator('.quiz h2')).toHaveText(second);
});
test('hint does not advance, skip advances exactly once',async({page})=>{
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  const first=await page.locator('.quiz h2').innerText();
  await page.locator('#hint').click();
  await expect(page.locator('.quiz h2')).toHaveText(first);
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await page.locator('#next').click();
  await expect(page.locator('.progress')).toContainText('1 / 1200');
  await expect(page.locator('.quiz h2')).not.toHaveText(first);
});
test('legacy mode remains the default',async({page})=>{
  await page.goto('/');
  await expect(page.locator('#mode')).toHaveValue('curated');
  await expect(page.locator('#subject')).toHaveCount(0);
  await expect(page.locator('.choices .choice')).toHaveCount(3);
});

test('storage write failure never advances generated question',async({page})=>{
  await page.addInitScript(()=>{
    const original=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key:string,value:string){
      if(key==='study-game-generated-progress-v1')throw new DOMException('Blocked','QuotaExceededError');
      return original.call(this,key,value);
    };
  });
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  const first=await page.locator('.quiz h2').innerText();
  await page.locator('[data-answer]').first().click();
  await expect(page.locator('.quiz h2')).toHaveText(first);
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await expect(page.locator('.feedback')).toContainText('진도 미반영');
  await page.locator('#next').click();
  await expect(page.locator('.quiz h2')).toHaveText(first);
  await expect(page.locator('.progress')).toContainText('0 / 1200');
});
test('legacy state write failure also blocks generated cursor advancement',async({page})=>{
  await page.addInitScript(()=>{
    const original=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key:string,value:string){
      if(key!=='study-game-generated-progress-v1')throw new DOMException('Blocked','QuotaExceededError');
      return original.call(this,key,value);
    };
  });
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  const first=await page.locator('.quiz h2').innerText();
  await page.locator('[data-answer]').first().click();
  await expect(page.locator('.quiz h2')).toHaveText(first);
  await expect(page.locator('.progress')).toContainText('0 / 1200');
});

test('duplicate clicks on the same answer button grant at most one attempt',async({page})=>{
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  await page.locator('[data-answer]').first().evaluate((button:HTMLElement)=>{
    button.click();
    button.click();
  });
  await expect(page.locator('.progress')).toContainText('1 / 1200');
  const attempts=await page.evaluate(()=>{
    const state=JSON.parse(localStorage.getItem('study-game-state-v1')??'null');
    return state?.attempts?.length??null;
  });
  // The cursor is the primary guard; a second click must not advance twice.
  await expect(page.locator('.progress')).toContainText('1 / 1200');
  if(attempts!==null)expect(attempts).toBe(1);
});

test('detached answer button from before hint rerender is ignored',async({page})=>{
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  await page.evaluate(()=>{(window as Window & {staleAnswer?:HTMLElement}).staleAnswer=document.querySelector('[data-answer]') as HTMLElement;});
  await page.locator('#hint').click();
  await page.evaluate(()=>{(window as Window & {staleAnswer?:HTMLElement}).staleAnswer?.click();});
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await page.locator('[data-answer]').first().click();
  await expect(page.locator('.progress')).toContainText('1 / 1200');
});

test('switching subject mid-question preserves each track and never submits an answer',async({page})=>{
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  const mathQuestion=await page.locator('.quiz h2').innerText();
  await page.locator('#hint').click();
  await page.locator('#subject').selectOption('korean');
  const koreanQuestion=await page.locator('.quiz h2').innerText();
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await page.locator('#subject').selectOption('math');
  await expect(page.locator('.quiz h2')).toHaveText(mathQuestion);
  await expect(page.locator('#hint-text')).toBeEmpty();
  await page.locator('#subject').selectOption('korean');
  await expect(page.locator('.quiz h2')).toHaveText(koreanQuestion);
  await page.locator('[data-answer]').first().click();
  await expect(page.locator('.progress')).toContainText('1 / 1200');
  await page.locator('#subject').selectOption('math');
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await expect(page.locator('.quiz h2')).toHaveText(mathQuestion);
  const attempts=await page.evaluate(()=>JSON.parse(localStorage.getItem('study-game-state-v1')??'{}').attempts?.length??0);
  expect(attempts).toBe(1);
});
test('reload during an unanswered question preserves progress and no phantom rewards',async({page})=>{
  await page.goto('/');
  await page.locator('#mode').selectOption('generated');
  await page.locator('#grade').selectOption('3');
  await page.locator('#subject').selectOption('korean');
  const question=await page.locator('.quiz h2').innerText();
  const stars=await page.locator('.stars').innerText();
  await page.locator('#hint').click();
  await page.reload();
  await page.locator('#mode').selectOption('generated');
  await page.locator('#subject').selectOption('korean');
  await expect(page.locator('#grade')).toHaveValue('3');
  await expect(page.locator('.quiz h2')).toHaveText(question);
  await expect(page.locator('.stars')).toHaveText(stars);
  await expect(page.locator('.progress')).toContainText('0 / 1200');
  await expect(page.locator('#hint-text')).toBeEmpty();
});
