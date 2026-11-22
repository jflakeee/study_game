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

test('grade 2 sentences have no duplicated punctuation',async()=>{
  const {koreanQuestionAt}=await import('../src/korean-generator.ts');
  for(let index=0;index<1200;index++){
    const q=koreanQuestionAt(2,index);
    assert.ok(!q.prompt.includes('..'),q.id);
    assert.ok(!q.prompt.includes('다. .'),q.id);
  }
});
test('grade 3 reading prompts never add a conflicting location prefix',async()=>{
  const {koreanQuestionAt}=await import('../src/korean-generator.ts');
  for(let index=0;index<1200;index++){
    const q=koreanQuestionAt(3,index);
    assert.ok(!/^(집에서|학교에서|친구와|가족과) /.test(q.prompt),q.id);
  }
});
