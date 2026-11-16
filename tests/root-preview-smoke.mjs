import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port=4180;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort','--base','/'],{stdio:'ignore'});
let browser;
try{
 let ready=false;
 for(let i=0;i<60;i++){
  try{const response=await fetch('http://127.0.0.1:'+port+'/');if(response.ok){ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 assert.ok(ready,'root-path preview did not start');
 browser=await chromium.launch({headless:true});
 const errors=[];
 browser.on('context',context=>context.on('page',page=>{
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
 }));
 const page=await browser.newPage();
 await page.addInitScript(()=>{Math.random=()=>0;});
 await page.goto('http://127.0.0.1:'+port+'/');
 await page.locator('h1').filter({hasText:/지식 탐험대/}).waitFor();
 assert.equal(await page.locator('[data-answer]').count(),3);
 await page.locator('[data-answer]').nth(1).click();
 await page.locator('.feedback').filter({hasText:/별 1개 획득/}).waitFor();
 assert.match(await page.locator('.stars').innerText(),/1개/);
 await page.locator('#next').filter({hasText:/다음 문제로/}).waitFor();
 await page.locator('#next').focus();
 await page.keyboard.press('Enter');
 await page.locator('#next:focus').waitFor();
 assert.equal(await page.locator('[data-answer]:not([disabled])').count(),3,'answers must be enabled for the new question');
 assert.equal(await page.locator('.feedback').innerText(),'','completed question feedback must clear when advancing');
 assert.match(await page.locator('.stars').innerText(),/1개/);
 await page.reload();
 assert.match(await page.locator('.stars').innerText(),/1개/);
 const hintPage=await browser.newPage();
 await hintPage.addInitScript(()=>{Math.random=()=>0;});
 await hintPage.goto('http://127.0.0.1:'+port+'/');
 await hintPage.evaluate(()=>{window.__feedbackNode=document.querySelector('.feedback');});
 await hintPage.locator('#hint').focus();
 await hintPage.keyboard.press('Enter');
 await hintPage.locator('#hint:focus').waitFor();
 await hintPage.locator('.feedback').filter({hasText:/./}).waitFor();
 assert.equal(await hintPage.evaluate(()=>document.querySelector('.feedback')===window.__feedbackNode),true,'live feedback node must persist after hint');
 await hintPage.locator('[data-answer]').nth(1).focus();
 await hintPage.keyboard.press('Enter');
 await hintPage.locator('.feedback').filter({hasText:/정답이에요/}).waitFor();
 assert.equal(await hintPage.evaluate(()=>document.querySelector('.feedback')===window.__feedbackNode),true,'live feedback node must persist after answer');
 await hintPage.locator('#next:focus').waitFor();
 assert.equal(await hintPage.locator('[data-answer]:not([disabled])').count(),0);
 assert.match(await hintPage.locator('.stars').innerText(),/0개/);
 const hinted=await hintPage.evaluate(()=>JSON.parse(localStorage.getItem('study-game-state-v1')));
 assert.equal(hinted.stars,0);
 assert.equal(hinted.attempts.length,1,'hinted answer must persist one attempt');
 await hintPage.reload();
 assert.match(await hintPage.locator('.stars').innerText(),/0개/);
 await hintPage.close();
 const gradePage=await browser.newPage();
 await gradePage.goto('http://127.0.0.1:'+port+'/');
 await gradePage.evaluate(()=>{window.__feedbackNode=document.querySelector('.feedback');});
 await gradePage.locator('#grade').focus();
 await gradePage.locator('#grade').selectOption('2');
 await gradePage.waitForFunction(()=>JSON.parse(localStorage.getItem('study-game-state-v1')||'null')?.grade===2);
 await gradePage.locator('#grade:focus').waitFor();
 assert.equal(await gradePage.locator('#grade').inputValue(),'2','selected grade must remain visible');
 assert.equal(await gradePage.evaluate(()=>document.querySelector('.feedback')===window.__feedbackNode),true,'live feedback node must persist after grade change');
 await gradePage.reload();
 assert.equal(await gradePage.locator('#grade').inputValue(),'2','selected grade must survive reload');
 await gradePage.close();
 const nextPage=await browser.newPage();
 await nextPage.goto('http://127.0.0.1:'+port+'/');
 await nextPage.evaluate(()=>{window.__feedbackNode=document.querySelector('.feedback');});
 await nextPage.locator('#next').focus();
 await nextPage.keyboard.press('Enter');
 await nextPage.locator('#next:focus').waitFor();
 assert.equal(await nextPage.evaluate(()=>document.querySelector('.feedback')===window.__feedbackNode),true,'live feedback node must persist after skipping to another question');
 assert.equal(await nextPage.locator('[data-answer]:not([disabled])').count(),3,'next question must have enabled answers');
 assert.equal(await nextPage.locator('.feedback').innerText(),'','new question must clear prior feedback');
 await nextPage.close();
 const wrongPage=await browser.newPage();
 await wrongPage.addInitScript(()=>{Math.random=()=>0;});
 await wrongPage.goto('http://127.0.0.1:'+port+'/');
 await wrongPage.evaluate(()=>{window.__feedbackNode=document.querySelector('.feedback');});
 for(let attempt=1;attempt<=3;attempt++){
  await wrongPage.locator('[data-answer]').first().click();
  if(attempt===1)await wrongPage.locator('.feedback').filter({hasText:/./}).waitFor();
  if(attempt===2)await wrongPage.locator('.feedback').filter({hasText:/다른 방법으로/}).waitFor();
  if(attempt===3){
   await wrongPage.locator('#next').filter({hasText:/다음 문제로/}).waitFor();
   await wrongPage.locator('#next:focus').waitFor();
   assert.equal(await wrongPage.locator('[data-answer]:not([disabled])').count(),0,'answers must be disabled after final incorrect attempt');
  }else{
   await wrongPage.locator('[data-answer="0"]:focus').waitFor();
  }
  assert.equal(await wrongPage.evaluate(()=>document.querySelector('.feedback')===window.__feedbackNode),true,'live feedback node must persist across incorrect answer stage '+attempt);
  assert.match(await wrongPage.locator('.stars').innerText(),/0개/);
  const saved=await wrongPage.evaluate(()=>JSON.parse(localStorage.getItem('study-game-state-v1')));
  if(attempt<3)assert.equal(saved,null,'early wrong answer should not persist an attempt');
 }
 await wrongPage.waitForFunction(()=>{const saved=localStorage.getItem('study-game-state-v1');return saved!==null&&JSON.parse(saved).attempts.length===1;},null,{timeout:5000});
 const wrong=await wrongPage.evaluate(()=>JSON.parse(localStorage.getItem('study-game-state-v1')));
 assert.equal(wrong.stars,0);
 assert.equal(wrong.attempts.length,1,'third wrong answer must persist one attempt');
 assert.equal(wrong.attempts[0].correct,false,'third wrong answer must be recorded as incorrect');
 assert.equal(wrong.attempts[0].usedHint,true,'tutored incorrect attempt must record hint usage');
 await wrongPage.reload();
 assert.match(await wrongPage.locator('.stars').innerText(),/0개/);
 const persistedWrong=await wrongPage.evaluate(()=>JSON.parse(localStorage.getItem('study-game-state-v1')));
 assert.equal(persistedWrong.attempts.length,1,'incorrect attempt must survive reload');
 assert.equal(persistedWrong.attempts[0].correct,false);
 await wrongPage.close();
 assert.deepEqual(errors,[],'root preview console/network errors');
 console.log('PASS root preview loads without errors; correct reward persists; hinted/wrong answers do not grant stars');
}finally{
 await browser?.close();
 server.kill();
}
