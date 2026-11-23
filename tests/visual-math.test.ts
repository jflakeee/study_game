import test from 'node:test';
import assert from 'node:assert/strict';
import {visualMathScene,renderVisualMathScene} from '../src/visual-math.ts';
import type {Question} from '../src/learning.ts';

function question(prompt:string,answer:string,grade:1|2|3=1,subject:'math'|'korean'='math'):Question {
  return {id:'test',grade,subject,skillId:'test',prompt,choices:[answer],answer,hint:'',explanation:''};
}
test('visual addition renders both countable groups',()=>{
  const scene=visualMathScene(question('7 + 5 = ?','12'));
  assert.ok(scene);
  const html=renderVisualMathScene(scene);
  assert.equal((html.match(/class="visual-dot"/g)||[]).length,12);
  assert.match(html,/aria-label="7 더하기 5"/);
});
test('visual subtraction crosses out only removed items in the original set',()=>{
  const scene=visualMathScene(question('13 - 4 = ?','9'));
  assert.ok(scene);
  const html=renderVisualMathScene(scene);
  assert.equal((html.match(/class="visual-dot/g)||[]).length,13);
  assert.equal((html.match(/class="visual-dot eaten"/g)||[]).length,4);
  assert.equal((html.match(/<svg viewBox=/g)||[]).length,4);
  assert.doesNotMatch(html,/visual-operator" aria-hidden="true">−/);
});
test('invalid answer and non-math questions keep text fallback',()=>{
  assert.equal(visualMathScene(question('7 + 5 = ?','11')),null);
  assert.equal(visualMathScene(question('7 + 5 = ?','12',2)),null);
  assert.equal(visualMathScene(question('7 + 5 = ?','12',1,'korean')),null);
  assert.equal(visualMathScene(question('7 + ? = 12','5')),null);
});
