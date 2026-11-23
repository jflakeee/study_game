import type {Grade, Question, Subject} from './learning.ts';

// P7-01: a deterministic, side-effect-free generation contract.
// Generators are registered per curriculum skill, not per subject.
export interface QuestionGenerator {
  readonly grade: Grade;
  readonly subject: Subject;
  readonly skillId: string;
  readonly count: number;
  generate(index: number): Question;
}

export function generatedQuestionId(skillId: string, index: number): string {
  if (!Number.isSafeInteger(index) || index < 0) throw new RangeError('Invalid question index');
  return `gen-v1:${skillId}:${index}`;
}

export function questionAt(generator: QuestionGenerator, index: number): Question {
  if (!Number.isSafeInteger(index) || index < 0 || index >= generator.count) {
    throw new RangeError('Question index out of range');
  }
  const question = generator.generate(index);
  if (question.id !== generatedQuestionId(generator.skillId, index) ||
      question.grade !== generator.grade ||
      question.subject !== generator.subject ||
      question.skillId !== generator.skillId ||
      !question.prompt.trim() ||
      question.choices.length < 2 ||
      new Set(question.choices).size !== question.choices.length ||
      question.choices.filter(choice => choice === question.answer).length !== 1) {
    throw new Error('Invalid generated question');
  }
  return question;
}

// Enumerates each index once in a reproducible order without storing all questions.
// The step is coprime with count, so every index is visited before repeating.
export function sequentialIndex(position: number, count: number, offset = 0): number {
  if (!Number.isSafeInteger(count) || count <= 0 ||
      !Number.isSafeInteger(position) || position < 0 ||
      !Number.isSafeInteger(offset) || offset < 0) throw new RangeError('Invalid sequence');
  const start = offset % count;
  return (start + (position % count)) % count;
}

export function nextGeneratedQuestion(generator: QuestionGenerator, position: number, offset = 0): Question {
  return questionAt(generator, sequentialIndex(position, generator.count, offset));
}
