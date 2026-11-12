export type TutorStage='probe'|'narrow'|'explain'|'retest'|'done';
export interface TutorSession {questionId:string;attempts:number;stage:TutorStage;lastPrompt:string}
export interface TutorStep {session:TutorSession;message:string;showExplanation:boolean;finished:boolean}
export function beginTutor(questionId:string,prompt:string):TutorSession{return {questionId,attempts:0,stage:'probe',lastPrompt:prompt};}
/** Deterministic child-friendly Socratic scaffold; no AI-generated claims. */
export function advanceTutor(session:TutorSession,correct:boolean,hint:string,explanation:string):TutorStep{
 if(session.stage==='done')return {session,message:'이미 끝난 문제예요.',showExplanation:false,finished:true};
 if(correct)return {session:{...session,stage:'done'},message:'어떻게 생각해서 맞혔는지 설명해 볼까요?',showExplanation:false,finished:true};
 const attempts=session.attempts+1;
 if(attempts===1)return {session:{...session,attempts,stage:'narrow',lastPrompt:hint},message:hint,showExplanation:false,finished:false};
 if(attempts===2)return {session:{...session,attempts,stage:'narrow',lastPrompt:'다른 방법으로 한 번 더 생각해 보세요.'},message:'다른 방법으로 한 번 더 생각해 보세요.',showExplanation:false,finished:false};
 return {session:{...session,attempts,stage:'retest',lastPrompt:explanation},message:explanation+' 이제 비슷한 문제로 다시 확인해요.',showExplanation:true,finished:false};
}