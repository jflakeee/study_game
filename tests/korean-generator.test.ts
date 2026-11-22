import test from 'node:test';
import assert from 'node:assert/strict';
import {koreanGenerator,KOREAN_CONCEPT_COUNTS} from '../src/korean-generator.ts';
import {questionAt} from '../src/question-generator.ts';

for (const grade of [1,2,3] as const) {
  test(`grade ${grade}: Korean variants have valid answers and unique prompts`, () => {
    const generator = koreanGenerator(grade);
    const prompts = new Set<string>(), ids = new Set<string>();
    for (let i = 0; i < generator.count; i++) {
      const question = questionAt(generator, i);
      prompts.add(question.prompt); ids.add(question.id);
      assert.ok(question.hint.length && question.explanation.length);
      assert.equal(question.choices.filter(choice => choice === question.answer).length,1);
    }
    assert.equal(ids.size,1200);
    assert.equal(prompts.size,1200);
  });
}

test('Korean question counts distinguish surface variants from learning concepts', () => {
  assert.deepEqual(KOREAN_CONCEPT_COUNTS,{1:40,2:20,3:12});
  for (const grade of [1,2,3] as const) {
    assert.ok(KOREAN_CONCEPT_COUNTS[grade] < koreanGenerator(grade).count);
  }
});
test('Korean sentences use correct object particles and sentence punctuation', () => {
  const g1 = koreanGenerator(1);
  for (let i = 0; i < g1.count; i++) {
    const q = questionAt(g1,i);
    assert.doesNotMatch(q.prompt,/연필'를|사과'을|북'를|지우개'을/);
  }
  const g3 = koreanGenerator(3);
  for (let i = 0; i < g3.count; i++) {
    assert.match(questionAt(g3,i).prompt,/\. 이 글의 중심 내용은 무엇인가요\?$/);
  }
});
