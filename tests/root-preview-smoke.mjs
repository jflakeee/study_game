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
 const page=await browser.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
 await page.addInitScript(()=>{Math.random=()=>0;});
 await page.goto('http://127.0.0.1:'+port+'/');
 await page.locator('h1').filter({hasText:/지식 탐험대/}).waitFor();
 assert.equal(await page.locator('[data-answer]').count(),3);
 await page.locator('[data-answer]').nth(1).click();
 await page.locator('.feedback').filter({hasText:/별 1개 획득/}).waitFor();
 assert.match(await page.locator('.stars').innerText(),/1개/);
 await page.reload();
 assert.match(await page.locator('.stars').innerText(),/1개/);
 const hintPage=await browser.newPage();
 await hintPage.addInitScript(()=>{Math.random=()=>0;});
 await hintPage.goto('http://127.0.0.1:'+port+'/');
 await hintPage.locator('#hint').click();
 await hintPage.locator('[data-answer]').nth(1).click();
 await hintPage.locator('.feedback').filter({hasText:/정답이에요/}).waitFor();
 assert.match(await hintPage.locator('.stars').innerText(),/0개/);
 await hintPage.reload();
 assert.match(await hintPage.locator('.stars').innerText(),/0개/);
 await hintPage.close();
 const wrongPage=await browser.newPage();
 await wrongPage.addInitScript(()=>{Math.random=()=>0;});
 await wrongPage.goto('http://127.0.0.1:'+port+'/');
 await wrongPage.locator('[data-answer]').first().click();
 await wrongPage.locator('.feedback').filter({hasText:/\\S/}).waitFor();
 assert.match(await wrongPage.locator('.stars').innerText(),/0개/);
 await wrongPage.reload();
 assert.match(await wrongPage.locator('.stars').innerText(),/0개/);
 await wrongPage.close();
 assert.deepEqual(errors,[],'root preview console/network errors');
 console.log('PASS root preview loads without errors; correct reward persists; hinted/wrong answers do not grant stars');
}finally{
 await browser?.close();
 server.kill();
}
