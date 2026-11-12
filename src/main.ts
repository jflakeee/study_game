import './style.css';
import {questionsFor,recordAttempt,type Grade,type Question} from './learning.ts';
import {loadState,saveStateSafely,STORAGE_KEY} from './storage.ts';
import {isDue} from './review.ts';
import {beginTutor,advanceTutor,type TutorSession} from './tutor.ts';
import {concepts,masteryFromAttempts} from './mastery.ts';
const root=document.querySelector<HTMLElement>('#app');if(!root)throw new Error('Missing app root');
let state=loadState(localStorage);
let selected:Question|null=null;
let tutor:TutorSession|null=null;
let usedHint=false;
let feedback='';
let finished=false;
let saving=false;
const escape=(value:string)=>value.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
function chooseQuestion(){
 const all=questionsFor(state.grade);
 const due=all.filter(q=>isDue(state.reviews[q.skillId],new Date()));
 const pool=due.length?due:all;
 selected=pool[Math.floor(Math.random()*pool.length)]??null;
 tutor=selected?beginTutor(selected.id,selected.prompt):null;
 usedHint=false;feedback='';finished=false;
}
function render(){
 if(!root)return;
 if(!selected)chooseQuestion();
 const q=selected;
 const answered=state.attempts.length;
 const success=state.attempts.filter(a=>a.correct).length;
 const concept=q?concepts.find(c=>c.id===q.skillId):null;
 const progress=concepts.filter(item=>item.grade===state.grade).map(item=>{
  const history=state.attempts.filter(a=>a.skillId===item.id).map(a=>({conceptId:a.skillId,questionId:a.questionId,correct:a.correct,usedHint:a.usedHint,at:a.at}));
  const mastery=masteryFromAttempts(history,item.id);
  const review=state.reviews[item.id];
  return {concept:item,level:mastery?.level??0,due:isDue(review,new Date()),dueAt:review?.dueAt};
 });
 const dueCount=progress.filter(p=>p.due).length;
 root.innerHTML=`<div class="shell"><header><div class="eyebrow">STUDY GAME · P0-B</div><h1>🌱 지식 탐험대</h1><p>스스로 생각하고 마을을 키워요!</p></header>
 <section class="toolbar"><label for="grade">학년 선택</label><select id="grade">${[1,2,3].map(n=>`<option value="${n}" ${state.grade===n?'selected':''}>${n}학년</option>`).join('')}</select><span class="stars" aria-live="polite">⭐ ${state.stars}개</span></section>
 <section class="village" aria-label="마을 성장"><div class="land">🏡 ${'🌳'.repeat(Math.min(8,Math.floor(state.stars/2)))}${state.stars>=4?'🏫':''}</div><small>학습 기록: ${answered}문제 · 정답 ${success}개</small></section>
 <section class="quiz" aria-label="개념별 학습 현황"><h2>📚 오늘의 복습 · ${dueCount}개 개념</h2>${progress.map(p=>`<p>${p.concept.subject==='math'?'🔢':'📖'} ${escape(p.concept.title)} · 숙련도 ${p.level}/5 · ${p.due?'지금 복습':'다음 복습 '+escape(new Date(p.dueAt!).toLocaleDateString('ko-KR'))}</p>`).join('')}</section>
 ${q?`<section class="quiz"><div class="subject">${q.subject==='math'?'🔢 수학':'📖 국어'} · ${state.grade}학년 · ${escape(concept?.title??'학습')}</div><h2>${escape(q.prompt)}</h2>
 <div class="choices">${q.choices.map((c,i)=>`<button class="choice" data-answer="${i}" ${finished?'disabled':''}>${escape(c)}</button>`).join('')}</div>
 <button class="hint" id="hint" ${finished?'disabled':''}>💡 생각 도우미</button>
 <p class="feedback" role="status" aria-live="polite">${escape(feedback)}</p>
 <button id="next" class="next">${finished?'다음 문제로 →':'다른 문제 풀기 ↻'}</button></section>`:''}
 <footer>기록은 이 브라우저에 저장돼요 · 복습은 학습 개념별로 진행돼요</footer></div>`;
 root.querySelector<HTMLSelectElement>('#grade')?.addEventListener('change',async e=>{
  if(saving)return;
  saving=true;
  const n=Number((e.target as HTMLSelectElement).value) as Grade;
  const next={...state,grade:n};
  const result=await saveStateSafely(localStorage,state,next,navigator.locks);
  saving=false;
  if(result==='saved'){state=next;chooseQuestion();}
  else feedback=result==='conflict'?'다른 탭에서 기록이 변경됐어요. 새로고침 후 다시 시도해 주세요.':'저장에 실패했어요. 브라우저 저장 공간을 확인해 주세요.';
  render();
 });
 root.querySelector('#hint')?.addEventListener('click',()=>{if(!q||finished)return;usedHint=true;feedback=q.hint;render();});
 root.querySelector('#next')?.addEventListener('click',()=>{chooseQuestion();render();});
 root.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(b=>b.addEventListener('click',async ()=>{
  if(!q||!tutor||finished||saving)return;
  const answer=q.choices[Number(b.dataset.answer)];
  const correct=answer===q.answer;
  const step=advanceTutor(tutor,correct,q.hint,q.explanation);
  tutor=step.session;
  if(correct){
   saving=true;
   const next=recordAttempt(state,q,answer,usedHint||tutor.attempts>0,new Date());
   const gained=next.stars>state.stars;
   const result=await saveStateSafely(localStorage,state,next,navigator.locks);
   const saved=result==='saved';
   if(saved)state=next;
   saving=false;
   finished=true;
   feedback=saved?'정답이에요! '+(gained?'⭐ 별 1개 획득! ':'')+step.message:result==='conflict'?'다른 탭에서 기록이 변경됐어요. 새로고침 후 다시 풀어 주세요.':'정답이지만 저장에 실패했어요. 별과 학습 기록은 반영되지 않았어요.';
  }else if(step.showExplanation){
   saving=true;
   const next=recordAttempt(state,q,answer,true,new Date());
   const result=await saveStateSafely(localStorage,state,next,navigator.locks);
   const saved=result==='saved';
   if(saved)state=next;
   finished=true;
   feedback=saved?step.message:result==='conflict'?'다른 탭에서 기록이 변경됐어요. 새로고침 후 다시 풀어 주세요.':'저장에 실패했어요. 학습 기록은 반영되지 않았어요.';
  }else{
   usedHint=true;
   feedback=step.message;
  }
  render();
 }));
}
window.addEventListener('storage',event=>{
 if(event.key===STORAGE_KEY){
  feedback='다른 탭에서 학습 기록이 변경됐어요. 최신 기록을 불러오려면 새로고침해 주세요.';
  render();
 }
});
render();
