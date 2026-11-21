import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyGeneratedProgress,advanceGeneratedProgress,currentGeneratedQuestion,generatedTrackStatus,saveGeneratedProgress,loadGeneratedProgress} from '../src/generated-progress.ts';

test('switching grade and subject never changes the other track cursor',()=>{
  let progress=emptyGeneratedProgress();
  const untouched=currentGeneratedQuestion(progress,2,'korean').id;
  for(let i=0;i<18;i++)progress=advanceGeneratedProgress(progress,1,'math');
  for(let i=0;i<9;i++)progress=advanceGeneratedProgress(progress,3,'math');
  for(let i=0;i<4;i++)progress=advanceGeneratedProgress(progress,1,'korean');
  assert.equal(currentGeneratedQuestion(progress,2,'korean').id,untouched);
  assert.equal(generatedTrackStatus(progress,1,'math').completed,18);
  assert.equal(generatedTrackStatus(progress,3,'math').completed,9);
  assert.equal(generatedTrackStatus(progress,1,'korean').completed,4);
  assert.equal(generatedTrackStatus(progress,2,'korean').completed,0);
});
test('re-render without submitting does not advance and reload restores the exact question',()=>{
  const data=new Map<string,string>();
  const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)}};
  let progress=emptyGeneratedProgress();
  const first=currentGeneratedQuestion(progress,2,'math').id;
  assert.equal(currentGeneratedQuestion(progress,2,'math').id,first);
  progress=advanceGeneratedProgress(progress,2,'math');
  assert.ok(saveGeneratedProgress(storage,progress));
  const restored=loadGeneratedProgress(storage);
  assert.equal(currentGeneratedQuestion(restored,2,'math').id,currentGeneratedQuestion(progress,2,'math').id);
  assert.notEqual(currentGeneratedQuestion(restored,2,'math').id,first);
});
test('skipping 1200 questions wraps once without duplicates',()=>{
  let progress=emptyGeneratedProgress();
  const seen=new Set<string>();
  for(let i=0;i<1200;i++){
    seen.add(currentGeneratedQuestion(progress,3,'korean').id);
    progress=advanceGeneratedProgress(progress,3,'korean');
  }
  assert.equal(seen.size,1200);
  assert.equal(generatedTrackStatus(progress,3,'korean').cycles,1);
  assert.equal(currentGeneratedQuestion(progress,3,'korean').id,currentGeneratedQuestion(emptyGeneratedProgress(),3,'korean').id);
});
