import test from 'node:test';
import assert from 'node:assert/strict';
import {koreanGenerator} from '../src/korean-generator.ts';
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
