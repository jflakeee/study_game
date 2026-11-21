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
      const normal = question.prompt.match(/^(\d+) ([+×-]) (\d+) = \?$/);
      const missing = question.prompt.match(/^(\d+) \+ \? = (\d+)$/);
      assert.ok(normal || missing, question.prompt);
      if (normal) {
        const a = Number(normal[1]), b = Number(normal[3]);
        const expected = normal[2] === '×' ? a * b : normal[2] === '-' ? a - b : a + b;
        assert.equal(Number(question.answer), expected);
        if (grade === 1) assert.ok(a <= 40 && b <= 40 && expected <= 40 && expected >= 0);
      } else if (missing) {
        assert.equal(Number(question.answer), Number(missing[2]) - Number(missing[1]));
        assert.ok(Number(missing[2]) <= 40);
      }
      assert.equal(question.choices.filter(choice => choice === question.answer).length, 1);
      if (grade === 1) assert.ok(question.choices.every(choice => Number(choice) >= 0 && Number(choice) <= 40), question.prompt);
    }
    assert.equal(ids.size, 1200);
    assert.equal(prompts.size, 1200);
    assert.deepEqual(mathQuestionAt(grade, 73), mathQuestionAt(grade, 73));
    assert.throws(() => mathQuestionAt(grade, 1200), RangeError);
  });
}
