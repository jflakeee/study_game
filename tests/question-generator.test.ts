import test from 'node:test';
import assert from 'node:assert/strict';
import {generatedQuestionId, questionAt, sequentialIndex, nextGeneratedQuestion, type QuestionGenerator} from '../src/question-generator.ts';

const generator: QuestionGenerator = {
  grade: 1, subject: 'math', skillId: 'math.add.10', count: 1001,
  generate(index) {
    const answer = String(index + 1);
    return {id: generatedQuestionId(this.skillId, index), grade: this.grade, subject: this.subject,
      skillId: this.skillId, prompt: `0 + ${answer} = ?`,
      choices: [answer, String(index + 2), String(index + 3)],
      answer, hint: '더해 보세요.', explanation: `정답은 ${answer}입니다.`};
  }
};
test('1001 positions are unique and deterministic before wrapping', () => {
  const ids = Array.from({length: generator.count}, (_, index) => nextGeneratedQuestion(generator, index, 13).id);
  assert.equal(new Set(ids).size, 1001);
  assert.equal(nextGeneratedQuestion(generator, 0, 13).id, nextGeneratedQuestion(generator, 1001, 13).id);
  assert.equal(nextGeneratedQuestion(generator, 23, 13).id, nextGeneratedQuestion(generator, 23, 13).id);
});
test('generated questions have stable IDs and valid single answers', () => {
  const q = questionAt(generator, 3);
  assert.equal(q.id, 'gen-v1:math.add.10:3');
  assert.equal(q.choices.filter(choice => choice === q.answer).length, 1);
});
test('invalid indices and malformed questions are rejected', () => {
  assert.throws(() => questionAt(generator, -1), RangeError);
  assert.throws(() => questionAt(generator, generator.count), RangeError);
  assert.throws(() => sequentialIndex(-1, 10), RangeError);
  assert.throws(() => sequentialIndex(0, 0), RangeError);
  assert.throws(() => generatedQuestionId('x', 1.5), RangeError);
  const invalid = {...generator, generate: (index: number) => ({...generator.generate(index), choices: ['1', '1']})};
  assert.throws(() => questionAt(invalid, 0), /Invalid generated question/);
});
