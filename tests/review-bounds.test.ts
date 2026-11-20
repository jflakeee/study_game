import test from 'node:test';
import assert from 'node:assert/strict';
import {scheduleReview,isDue} from '../src/review.ts';
import type {Rating,Review} from '../src/learning.ts';
const now=new Date('2026-11-20T00:00:00Z');
const day=86400000;
test('all review ratings remain bounded over successive due-date sessions',()=>{
 for(const rating of ['again','hard','good','easy'] as Rating[]){
  let previous:Review|undefined;let at=now;
  for(let i=0;i<12;i++){
   const next:Review=scheduleReview(previous,'skill',rating,at);
   assert.ok(next.intervalDays>=1&&next.intervalDays<=30);
   const due=Date.parse(next.dueAt);
   assert.equal(due,+at+next.intervalDays*day);
   assert.equal(isDue(next,new Date(due-1)),false);
   assert.equal(isDue(next,new Date(due)),true);
   previous=next;at=new Date(due);
  }
 }
});
test('early equivalent correct reviews retain existing schedule',()=>{
 for(const rating of ['good','easy'] as Rating[]){
  const first=scheduleReview(undefined,'skill',rating,now);
  for(let i=0;i<100;i++)assert.deepEqual(scheduleReview(first,'skill',rating,now),first);
 }
});
test('hint and wrong answers shorten long intervals',()=>{
 const previous:Review={skillId:'skill',repetitions:5,intervalDays:30,dueAt:new Date(+now+30*day).toISOString(),lastRating:'good'};
 assert.equal(scheduleReview(previous,'skill','hard',now).intervalDays,15);
 const wrong=scheduleReview(previous,'skill','again',now);
 assert.equal(wrong.intervalDays,1);assert.equal(wrong.repetitions,0);
});
test('legacy schedules become due without mutating stored state',()=>{
 const previous:Review={skillId:'skill',repetitions:12,intervalDays:4994,dueAt:new Date(+now+4994*day).toISOString(),lastRating:'good'};
 const raw=JSON.stringify(previous);
 assert.equal(isDue(previous,now),true);
 for(const rating of ['again','hard','good','easy'] as Rating[])assert.ok(scheduleReview(previous,'skill',rating,now).intervalDays<=30);
 assert.equal(JSON.stringify(previous),raw);
 assert.equal(isDue({...previous,intervalDays:1,dueAt:'invalid'},now),true);
 assert.equal(isDue({...previous,intervalDays:0},now),true);
 assert.equal(isDue({...previous,intervalDays:30,dueAt:new Date(+now+31*day).toISOString()},now),true);
 assert.equal(isDue(undefined,now),true);
});
