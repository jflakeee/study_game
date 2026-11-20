import test from 'node:test';import assert from 'node:assert/strict';
import {masteryFromAttempts} from '../src/mastery.ts';
test('empty history has no mastery',()=>{assert.equal(masteryFromAttempts([],'math.add.10'),undefined);});
test('v1 attempt history derives independent concept mastery',()=>{const attempts=[{conceptId:'math.add.10',questionId:'q1',correct:true,usedHint:false,at:'2026-11-12T00:00:00Z'},{conceptId:'math.add.10',questionId:'q2',correct:true,usedHint:false,at:'2026-11-12T01:00:00Z'}];assert.equal(masteryFromAttempts(attempts,'math.add.10')?.level,4);assert.equal(masteryFromAttempts(attempts,'math.mul.2'),undefined);});
test('hinted attempt does not certify mastery level four',()=>{const attempts=[{conceptId:'math.add.10',questionId:'q1',correct:true,usedHint:true,at:'2026-11-12T00:00:00Z'}];assert.equal(masteryFromAttempts(attempts,'math.add.10')?.level,2);});
