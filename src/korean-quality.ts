import type {Grade,Question} from './learning.ts';
import {koreanGenerator,KOREAN_CONCEPT_COUNTS} from './korean-generator.ts';
import {questionAt} from './question-generator.ts';

export interface KoreanQualityReport {
  grade: Grade;
  generatedVariants: number;
  distinctPrompts: number;
  distinctAnswers: number;
  coreConcepts: number;
  cosmeticVariantsPerConcept: number;
  answerLeakCandidates: number;
}
// A conservative audit: this is NOT a curriculum certification.
// A prompt containing the answer may be legitimate in category questions,
// so candidates must be reviewed, not automatically rejected.
export function auditKoreanGenerator(grade: Grade): KoreanQualityReport {
  const generator = koreanGenerator(grade);
  const prompts = new Set<string>();
  const answers = new Set<string>();
  let answerLeakCandidates = 0;
  for (let index = 0; index < generator.count; index++) {
    const question: Question = questionAt(generator,index);
    prompts.add(question.prompt);
    answers.add(question.answer);
    if (question.prompt.includes(question.answer)) answerLeakCandidates++;
  }
  const coreConcepts = KOREAN_CONCEPT_COUNTS[grade];
  return {
    grade,generatedVariants:generator.count,distinctPrompts:prompts.size,
    distinctAnswers:answers.size,coreConcepts,
    cosmeticVariantsPerConcept:generator.count/coreConcepts,
    answerLeakCandidates
  };
}
