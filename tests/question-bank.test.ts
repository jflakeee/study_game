import test from 'node:test';import assert from 'node:assert/strict';
import {questions,variantQuestions,questionsFor} from '../src/learning.ts';
import {concepts} from '../src/mastery.ts';
test('18 unique questions with valid answers',()=>{const all=[...questions,...variantQuestions];assert.equal(all.length,18);assert.equal(new Set(all.map(q=>q.id)).size,18);for(const q of all){assert.ok(q.choices.includes(q.answer));assert.equal(new Set(q.choices).size,q.choices.length);assert.ok(q.hint&&q.explanation);}});
test('every concept has at least two independent question variants',()=>{for(const c of concepts){const qs=questionsFor(c.grade,c.subject).filter(q=>q.skillId===c.id);assert.ok(qs.length>=2,c.id);}});
test('all grades and subjects have three questions',()=>{for(const g of [1,2,3] as const)for(const s of ['math','korean'] as const)assert.equal(questionsFor(g,s).length,3);});
