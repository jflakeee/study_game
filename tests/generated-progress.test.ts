import test from 'node:test';
import assert from 'node:assert/strict';
import {PROGRESS_KEY,emptyGeneratedProgress,loadGeneratedProgress,saveGeneratedProgress,
  currentGeneratedQuestion,advanceGeneratedProgress,generatedTrackStatus,parseGeneratedProgress} from '../src/generated-progress.ts';

test('1200 questions appear once before cycling for each grade and subject', () => {
  for (const grade of [1,2,3] as const) for (const subject of ['math','korean'] as const) {
    let progress = emptyGeneratedProgress();
    const ids = new Set<string>();
    for (let i = 0; i < 1200; i++) {
      ids.add(currentGeneratedQuestion(progress,grade,subject).id);
      progress = advanceGeneratedProgress(progress,grade,subject);
    }
    assert.equal(ids.size,1200);
    assert.equal(generatedTrackStatus(progress,grade,subject).completed,1200);
    assert.equal(generatedTrackStatus(progress,grade,subject).cycles,1);
    assert.equal(currentGeneratedQuestion(progress,grade,subject).id,currentGeneratedQuestion(emptyGeneratedProgress(),grade,subject).id);
  }
});
test('subject progress is independent, deterministic and immutable', () => {
  const before = emptyGeneratedProgress();
  const mathId = currentGeneratedQuestion(before,1,'math').id;
  const koreanId = currentGeneratedQuestion(before,1,'korean').id;
  const after = advanceGeneratedProgress(before,1,'math');
  assert.equal(currentGeneratedQuestion(before,1,'math').id,mathId);
  assert.notEqual(currentGeneratedQuestion(after,1,'math').id,mathId);
  assert.equal(currentGeneratedQuestion(after,1,'korean').id,koreanId);
  assert.equal(generatedTrackStatus(after,1,'math').completed,1);
});
test('generated progress survives reload independently of legacy v1 save', () => {
  const values = new Map<string,string>([['study-game-state-v1','legacy-data']]);
  const storage = {getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value)}};
  const progress = advanceGeneratedProgress(emptyGeneratedProgress(),2,'korean');
  assert.equal(saveGeneratedProgress(storage,progress),true);
  assert.deepEqual(loadGeneratedProgress(storage),progress);
  assert.equal(values.get('study-game-state-v1'),'legacy-data');
  assert.ok(values.has(PROGRESS_KEY));
});
test('malformed progress and unavailable storage fail safely', () => {
  assert.equal(parseGeneratedProgress('{'),null);
  assert.equal(parseGeneratedProgress('{"version":2,"tracks":{}}'),null);
  assert.equal(parseGeneratedProgress('{"version":1,"tracks":{"1:math":{"position":-1,"offset":0}}}'),null);
  assert.equal(parseGeneratedProgress('{"version":1,"tracks":{"4:math":{"position":1,"offset":0}}}'),null);
  const broken = {getItem:(_key:string):string=>{throw Error('blocked')},setItem:(_key:string,_value:string)=>{throw Error('blocked')}};
  assert.deepEqual(loadGeneratedProgress(broken),emptyGeneratedProgress());
  assert.equal(saveGeneratedProgress(broken,emptyGeneratedProgress()),false);
});
