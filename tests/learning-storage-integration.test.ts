import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,variantQuestions,expansionQuestions,extendedQuestions,createState,recordAttempt} from '../src/learning.ts';
import {loadState,saveStateIfUnchanged} from '../src/storage.ts';
const bank=[...questions,...variantQuestions,...expansionQuestions,...extendedQuestions];
test('all learning questions are covered',()=>assert.equal(bank.length,72));
for(const q of bank){
 test('reward and persistence: '+q.id,()=>{
  let raw:string|null=null;
  let fail=false;
  const storage={getItem:(_key:string)=>raw,setItem:(_key:string,value:string)=>{if(fail)throw Error('quota');raw=value;}};
  let current=createState(q.grade);
  const scenarios=[
   {answer:q.answer,hint:true,delta:0,rating:'hard'},
   {answer:q.answer,hint:false,delta:1,rating:'good'},
   {answer:q.answer,hint:false,delta:0,rating:'good'},
   {answer:'!wrong!',hint:false,delta:0,rating:'again'}
  ];
  for(const scenario of scenarios){
   const next=recordAttempt(current,q,scenario.answer,scenario.hint,new Date('2026-11-20T00:00:00Z'));
   assert.equal(next.stars-current.stars,scenario.delta);
   assert.equal(next.reviews[q.skillId].lastRating,scenario.rating);
   const before=raw;
   fail=true;
   assert.equal(saveStateIfUnchanged(storage,current,next),'error');
   assert.equal(raw,before);
   fail=false;
   assert.equal(saveStateIfUnchanged(storage,current,next),'saved');
   assert.deepEqual(loadState(storage),next);
   assert.equal(saveStateIfUnchanged(storage,current,next),'conflict');
   current=next;
  }
  raw=null;
  assert.equal(saveStateIfUnchanged(storage,current,current),'conflict');
  assert.equal(raw,null);
 });
}
