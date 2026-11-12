import type {Grade,Subject} from './learning.ts';
export interface Concept {id:string;grade:Grade;subject:Subject;title:string;prerequisites:readonly string[]}
export interface Evidence {conceptId:string;questionId:string;correct:boolean;usedHint:boolean;at:string}
export interface Mastery {conceptId:string;level:0|1|2|3|4|5;independentSuccesses:number;uniqueIndependentQuestions:string[];lastReviewedAt?:string}
export const concepts:readonly Concept[]=[
{id:'math.add.10',grade:1,subject:'math',title:'10 안의 덧셈',prerequisites:[]},
{id:'korean.word.1',grade:1,subject:'korean',title:'낱말 분류',prerequisites:[]},
{id:'math.mul.2',grade:2,subject:'math',title:'곱셈',prerequisites:['math.add.10']},
{id:'korean.sentence.2',grade:2,subject:'korean',title:'문장 속 원인',prerequisites:['korean.word.1']},
{id:'math.div.3',grade:3,subject:'math',title:'나눗셈',prerequisites:['math.mul.2']},
{id:'korean.reading.3',grade:3,subject:'korean',title:'중심 내용 찾기',prerequisites:['korean.sentence.2']}
];
/** Evidence-based levels: level 4 requires two distinct independent question IDs. */
export function updateMastery(previous:Mastery|undefined,e:Evidence):Mastery {
 const p=previous??{conceptId:e.conceptId,level:0 as const,independentSuccesses:0,uniqueIndependentQuestions:[]};
 if(p.conceptId!==e.conceptId)throw Error('Concept mismatch');
 const independent=e.correct&&!e.usedHint;
 const ids=independent?[...new Set([...p.uniqueIndependentQuestions,e.questionId])]:p.uniqueIndependentQuestions;
 const successes=independent?p.independentSuccesses+1:p.independentSuccesses;
 let level:number=p.level;
 if(!e.correct)level=Math.max(0,level-1);
 else if(e.usedHint)level=Math.max(level,2);
 else level=Math.max(level,ids.length>=2?4:3);
 return {...p,level:level as Mastery['level'],independentSuccesses:successes,uniqueIndependentQuestions:ids,lastReviewedAt:e.at};
}
export function selectDueConcepts(conceptIds:readonly string[],dueByConcept:Record<string,string|undefined>,now:Date):string[]{
 return conceptIds.filter(id=>!dueByConcept[id]||new Date(dueByConcept[id]!).getTime()<=now.getTime());
}
/** Rebuild concept progress from existing v1 attempts, without a storage migration. */
export function masteryFromAttempts(attempts:readonly Evidence[],conceptId:string):Mastery|undefined{
 let result:Mastery|undefined;
 for(const attempt of attempts){
  if(attempt.conceptId===conceptId)result=updateMastery(result,attempt);
 }
 return result;
}
