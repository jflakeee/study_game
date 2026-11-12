import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port=4178;
const server=spawn('npx',['vite','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'pipe',shell:process.platform==='win32'});
let browser;
async function waitForServer(){
 for(let i=0;i<60;i++){
  try{const response=await fetch('http://127.0.0.1:'+port+'/study_game/');if(response.ok)return;}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 throw Error('Vite preview server did not start');
}
try{
 await waitForServer();
 browser=await chromium.launch({headless:true});
 for(const width of [320,375,390,768]){
  const page=await browser.newPage({viewport:{width,height:780},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:'+port+'/study_game/');
  await page.locator('h1').waitFor();
  assert.match(await page.locator('h1').innerText(),/지식 탐험대/);
  assert.equal(await page.locator('[data-answer]').count(),3);
  const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  assert.ok(dimensions.scroll<=dimensions.client,'horizontal overflow at '+width+': '+JSON.stringify(dimensions));
  await page.locator('#grade').selectOption('2');
  await page.locator('.subject').waitFor();
  assert.match(await page.locator('.subject').innerText(),/2학년/);
  await page.locator('#hint').click();
  assert.ok((await page.locator('.feedback').innerText()).length>0);
  await page.screenshot({path:'/tmp/p0b-'+width+'.png',fullPage:true});
  console.log('PASS viewport '+width);
  await page.close();
 }
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:'+port+'/study_game/');
 const q=await page.locator('.quiz').last().locator('h2').innerText();
 const answers=page.locator('[data-answer]');
 assert.equal(await answers.count(),3);
 await answers.first().click();
 await page.locator('.feedback').filter({hasText:/\S/}).waitFor({timeout:5000});
 console.log('PASS answer interaction for '+q);
 await page.close();
}finally{
 await browser?.close();
 server.kill();
}
