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
    assert.ok(report.cosmeticVariantsPerConcept >= 30);
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

test('Korean grades 1 and 2 have expanded semantic concepts without ambiguous vocabulary',async()=>{
  const {KOREAN_CONCEPT_COUNTS,koreanQuestionAt}=await import('../src/korean-generator.ts');
  assert.equal(KOREAN_CONCEPT_COUNTS[1],40);
  assert.equal(KOREAN_CONCEPT_COUNTS[2],20);
  const categories=new Map<string,string>();
  for(let i=0;i<40;i++){
    const q=koreanQuestionAt(1,i);
    const word=q.prompt.match(/'([^']+)'/g)?.[0];
    assert.ok(word,q.id);
    assert.ok(!categories.has(word!),`duplicate category term: ${word}`);
    categories.set(word!,q.answer);
  }
  for(let i=0;i<1200;i++){
    for(const grade of [1,2] as const){
      const q=koreanQuestionAt(grade,i);
      assert.equal(q.choices.length,3,q.id);
      assert.equal(new Set(q.choices).size,3,q.id);
      assert.ok(q.choices.includes(q.answer),q.id);
    }
  }
});

test('grade 3 reading expands to 24 semantic actions with valid options',async()=>{
  const {KOREAN_CONCEPT_COUNTS,koreanQuestionAt}=await import('../src/korean-generator.ts');
  assert.equal(KOREAN_CONCEPT_COUNTS[3],24);
  const topics=new Set<string>();
  for(let i=0;i<1200;i++){
    const q=koreanQuestionAt(3,i);
    assert.equal(q.choices.length,3,q.id);
    assert.equal(new Set(q.choices).size,3,q.id);
    assert.ok(q.choices.includes(q.answer),q.id);
    if(i<24)topics.add(q.answer);
  }
  assert.equal(topics.size,24);
});
