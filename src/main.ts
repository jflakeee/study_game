import './style.css';
import {questionsFor,recordAttempt,type Grade,type Question} from './learning.ts';
import {loadState,saveState} from './storage.ts';
import {isDue} from './review.ts';
import {beginTutor,advanceTutor,type TutorSession} from './tutor.ts';
import {concepts} from './mastery.ts';
const root=document.querySelector<HTMLElement>('#app');if(!root)throw new Error('Missing app root');
let state=loadState(localStorage);
let selected:Question|null=null;
let tutor:TutorSession|null=null;
let usedHint=false;
let feedback='';
let finished=false;
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
 root.innerHTML=`<div class="shell"><header><div class="eyebrow">STUDY GAME · P0-B</div><h1>🌱 지식 탐험대</h1><p>스스로 생각하고 마을을 키워요!</p></header>
 <section class="toolbar"><label for="grade">학년 선택</label><select id="grade">${[1,2,3].map(n=>`<option value="${n}" ${state.grade===n?'selected':''}>${n}학년</option>`).join('')}</select><span class="stars" aria-live="polite">⭐ ${state.stars}개</span></section>
 <section class="village" aria-label="마을 성장"><div class="land">🏡 ${'🌳'.repeat(Math.min(8,Math.floor(state.stars/2)))}${state.stars>=4?'🏫':''}</div><small>학습 기록: ${answered}문제 · 정답 ${success}개</small></section>
 ${q?`<section class="quiz"><div class="subject">${q.subject==='math'?'🔢 수학':'📖 국어'} · ${state.grade}학년 · ${escape(concept?.title??'학습')}</div><h2>${escape(q.prompt)}</h2>
 <div class="choices">${q.choices.map((c,i)=>`<button class="choice" data-answer="${i}" ${finished?'disabled':''}>${escape(c)}</button>`).join('')}</div>
 <button class="hint" id="hint" ${finished?'disabled':''}>💡 생각 도우미</button>
 <p class="feedback" role="status" aria-live="polite">${escape(feedback)}</p>
 <button id="next" class="next">${finished?'다음 문제로 →':'다른 문제 풀기 ↻'}</button></section>`:''}
 <footer>기록은 이 브라우저에 저장돼요 · 복습은 학습 개념별로 진행돼요</footer></div>`;
 root.querySelector<HTMLSelectElement>('#grade')?.addEventListener('change',e=>{
  const n=Number((e.target as HTMLSelectElement).value) as Grade;
  state={...state,grade:n};
  const saved=saveState(localStorage,state);
  chooseQuestion();
  if(!saved)feedback='저장에 실패했어요. 브라우저 저장 공간을 확인해 주세요.';
  render();
 });
 root.querySelector('#hint')?.addEventListener('click',()=>{if(!q||finished)return;usedHint=true;feedback=q.hint;render();});
 root.querySelector('#next')?.addEventListener('click',()=>{chooseQuestion();render();});
 root.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
  if(!q||!tutor||finished)return;
  const answer=q.choices[Number(b.dataset.answer)];
  const correct=answer===q.answer;
  const step=advanceTutor(tutor,correct,q.hint,q.explanation);
  tutor=step.session;
  if(correct){
   state=recordAttempt(state,q,answer,usedHint||tutor.attempts>0,new Date());
   finished=true;
   const saved=saveState(localStorage,state);
   feedback='정답이에요! ⭐ '+step.message+(saved?'':' 저장에 실패했어요.');
  }else if(step.showExplanation){
   state=recordAttempt(state,q,answer,true,new Date());
   finished=true;
   const saved=saveState(localStorage,state);
   feedback=step.message+(saved?'':' 저장에 실패했어요.');
  }else{
   usedHint=true;
   feedback=step.message;
  }
  render();
 }));
}
render();
