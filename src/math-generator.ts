import type {Grade, Question} from './learning.ts';
import {generatedQuestionId, questionAt, type QuestionGenerator} from './question-generator.ts';

// 1,200 distinct operand pairs per grade. No runtime randomness or network access.
export function mathGenerator(grade: Grade): QuestionGenerator {
  const skillId = grade === 1 ? 'math.add.100' : grade === 2 ? 'math.add.1000' : 'math.multiply.2digit';
  return {
    grade, subject: 'math', skillId, count: 1200,
    generate(index: number): Question {
      if (!Number.isSafeInteger(index) || index < 0 || index >= 1200) throw new RangeError('Question index out of range');
      const row = Math.floor(index / 20);
      const col = index % 20;
      const a = grade === 1 ? row + 1 : grade === 2 ? row + 100 : row + 10;
      const b = grade === 1 ? col + 1 : grade === 2 ? col + 20 : col + 2;
      const multiply = grade === 3;
      const result = multiply ? a * b : a + b;
      const choices = [String(result), String(result + 1), String(result + (multiply ? 2 : 10))];
      const shift = index % choices.length;
      const rotated = [...choices.slice(shift), ...choices.slice(0, shift)];
      return {
        id: generatedQuestionId(skillId, index), grade, subject: 'math', skillId,
        prompt: `${a} ${multiply ? '×' : '+'} ${b} = ?`,
        choices: rotated, answer: String(result),
        hint: multiply ? `${a}를 ${b}번 더하는 곱셈이에요.` : `${a}부터 ${b}만큼 더해 보세요.`,
        explanation: `${a} ${multiply ? '×' : '+'} ${b} = ${result}이에요.`
      };
    }
  };
}

export function mathQuestionAt(grade: Grade, index: number): Question {
  const generator = mathGenerator(grade);
  return questionAt(generator, index);
}
