export type TutorStage='probe'|'narrow'|'explain'|'retest'|'done';
export interface TutorSession {questionId:string;attempts:number;stage:TutorStage;lastPrompt:string}
export interface TutorStep {session:TutorSession;message:string;showExplanation:boolean;finished:boolean}
export function beginTutor(questionId:string,prompt:string):TutorSession{return {questionId,attempts:0,stage:'probe',lastPrompt:prompt};}
/** Deterministic child-friendly Socratic scaffold; no AI-generated claims. */
export function advanceTutor(session:TutorSession,correct:boolean,hint:string,explanation:string):TutorStep{
 if(session.stage==='done')return {session,message:'이미 끝난 문제예요.',showExplanation:false,finished:true};
 if(correct)return {session:{...session,stage:'done'},message:'어떻게 생각해서 맞혔는지 설명해 볼까요?',showExplanation:false,finished:true};
 const attempts=session.attempts+1;
 if(attempts===1)return {session:{...session,attempts,stage:'narrow',lastPrompt:hint},message:'괜찮아요! 힌트를 보고 다시 생각해 봐요. '+hint,showExplanation:false,finished:false};
 if(attempts===2)return {session:{...session,attempts,stage:'narrow',lastPrompt:'다른 방법으로 한 번 더 생각해 보세요.'},message:'좋아요, 계속 도전해 봐요! 다른 방법으로 한 번 더 생각해 보세요. '+hint,showExplanation:false,finished:false};
 return {session:{...session,attempts,stage:'retest',lastPrompt:explanation},message:'함께 정답을 알아볼까요? '+explanation+' 다음 문제에서도 도전해 봐요.',showExplanation:true,finished:false};
}