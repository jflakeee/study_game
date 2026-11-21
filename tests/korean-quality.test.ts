import test from 'node:test';
import assert from 'node:assert/strict';
import {auditKoreanGenerator} from '../src/korean-quality.ts';

test('Korean audit reports distinct prompts and limited underlying concepts honestly', () => {
  for (const grade of [1,2,3] as const) {
    const report = auditKoreanGenerator(grade);
    assert.equal(report.generatedVariants,1200);
    assert.equal(report.distinctPrompts,1200);
    assert.ok(report.coreConcepts < report.generatedVariants);
    assert.ok(report.distinctAnswers <= report.coreConcepts);
    assert.ok(report.cosmeticVariantsPerConcept >= 40);
    assert.ok(report.answerLeakCandidates >= 0 && report.answerLeakCandidates <= 1200);
  }
});
