import test from 'node:test';import assert from 'node:assert/strict';
import {createState,questionsFor,recordAttempt} from '../src/learning.ts';
const q=questionsFor(1,'math')[0],now=new Date('2026-11-12T00:00:00.000Z');
test('only first independent success earns a star',()=>{const first=recordAttempt(createState(),q,q.answer,false,now);const repeat=recordAttempt(first,q,q.answer,false,now);assert.equal(first.stars,1);assert.equal(repeat.stars,1);assert.equal(repeat.attempts.length,2);});
test('hint-assisted success earns no star',()=>{assert.equal(recordAttempt(createState(),q,q.answer,true,now).stars,0);});
test('wrong answer earns no star',()=>{const wrong=q.choices.find(x=>x!==q.answer)!;assert.equal(recordAttempt(createState(),q,wrong,false,now).stars,0);});
test('hinted first then independent success earns exactly one star',()=>{const hinted=recordAttempt(createState(),q,q.answer,true,now);const independent=recordAttempt(hinted,q,q.answer,false,now);assert.equal(independent.stars,1);});
