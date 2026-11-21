import test from 'node:test';
import assert from 'node:assert/strict';
import {mathGenerator, mathQuestionAt} from '../src/math-generator.ts';
import {questionAt, sequentialIndex} from '../src/question-generator.ts';

for (const grade of [1, 2, 3] as const) {
  test(`grade ${grade}: 1200 distinct, correct, deterministic math questions`, () => {
    const generator = mathGenerator(grade);
    const ids = new Set<string>();
    const prompts = new Set<string>();
    for (let i = 0; i < generator.count; i++) {
      const question = questionAt(generator, sequentialIndex(i, generator.count, 71));
      ids.add(question.id);
      prompts.add(question.prompt);
      const match = question.prompt.match(/^(\\d+) ([+×]) (\\d+) = \\?$/);
      assert.ok(match, question.prompt);
      const a = Number(match[1]), b = Number(match[3]);
      assert.equal(Number(question.answer), match[2] === '×' ? a * b : a + b);
      assert.equal(question.choices.filter(choice => choice === question.answer).length, 1);
    }
    assert.equal(ids.size, 1200);
    assert.equal(prompts.size, 1200);
    assert.deepEqual(mathQuestionAt(grade, 73), mathQuestionAt(grade, 73));
    assert.throws(() => mathQuestionAt(grade, 1200), RangeError);
  });
}
