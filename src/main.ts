import './style.css';
import {hiddenMissions,createHiddenSession,findHiddenObject,type HiddenSession} from './hidden-game.ts';
import {puzzleMissions,puzzleForGrade,createPuzzleSession,selectPuzzleTile,type PuzzleSession} from './puzzle-game.ts';
import {sortMissions,createSortSession,placeSortItem,checkSortSession,type SortSession} from './sort-game.ts';
import {loadVillage,saveVillage,VILLAGE_KEY,emptySlots,type Slots} from './village-storage.ts';
import {play,unlockAudio} from 'plinkfx';
let soundEnabled=false;
function sound(name:'coin'|'confirm'|'click-soft'){if(soundEnabled){try{play(name,{volume:.22});}catch{/* audio must never interrupt learning */}}}
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
let gardenCount=0;
let gardenGroups=1;
let gardenOpen=false;
let feedback='';
let storageConflict=false;
let activeView:'learn'|'village'|'explore'='learn';
let sortCareer='free';
let sortSession:SortSession=createSortSession(sortMissions.free);
let sortSelectedItem:string|null=null;
let sortFeedback='';
let puzzleCareer='free';
let puzzleSession:PuzzleSession=createPuzzleSession(puzzleMissions.free);
let puzzleNotice='';
let hiddenCareer='free';
let hiddenSession:HiddenSession=createHiddenSession(hiddenMissions.free);
let hiddenHint=false;
let finished=false;
let saving=false;
let sessionCompleted=0;
let expedition=false;
let expeditionCompleted=0;
let selectedBuilding=0;
let selectedRegion=0;
let villageSnapshot=loadVillage(localStorage);
let villageSlots:Slots=villageSnapshot.slots;
let villageNotice=villageSnapshot.readable?'':'건축 기록을 읽을 수 없어요. 기존 기록은 보존됩니다.';
let previousSlots:(number|null)[]|null=null;
const buildingIcons=['🏡','🌳','🏫','📚','🏛️','🌷','🎡','🗼','🚩'];
async function commitVillage(next:Slots,undo:Slots|null){
 if(saving||!villageSnapshot.readable)return false;
 saving=true;
 const result=await saveVillage(localStorage,villageSnapshot.raw,next,navigator.locks);
 saving=false;
 if(result.ok){villageSnapshot={raw:result.raw,slots:next,readable:true};villageSlots=next;previousSlots=undo;villageNotice='건축 기록을 저장했어요.';}else villageNotice='건축 기록을 저장하지 못했어요. 새로고침 후 다시 시도해 주세요.';
 render();return result.ok;
}
const sessionGoal=3;
let renderedVillageStage:number|undefined;
const escape=(value:string)=>value.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
function villageArt(level:number){
 const house=(x:number,y:number,wall:string,roof:string,scale=1,kind='home')=>`<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-30 0 0 16 30 0 0-16Z" fill="#a4cb91"/><path d="M-23-29 0-16 0 10-23-3Z" fill="${wall}"/><path d="M0-16 23-29 23-3 0 10Z" fill="#d5bca2"/><path d="M-29-29-7-49 30-29 0-12Z" fill="${roof}"/><path d="M-7-49 14-48 30-29 8-36Z" fill="#b97872"/><path d="M-15-17-7-12-7 2-15-3Z" fill="#795e55"/><path d="M7-16 16-21 16-12 7-7Z" fill="#b7e6f4"/><path d="M11-18V-10" stroke="#fff" stroke-width="1"/>${kind==='school'?'<path d="M-2-46V-66" stroke="#776c60" stroke-width="2"/><path d="M-1-65 16-60-1-55Z" fill="#f5bd60"/><circle cy="-24" r="5" fill="#fff4cf"/><path d="M0-27V-24L2-23" fill="none" stroke="#776c60"/>':kind==='library'?'<rect x="-18" y="-28" width="15" height="9" rx="2" fill="#fff4cf"/><path d="M-15-26H-6M-15-23H-6" stroke="#9175b8"/>':kind==='hall'?'<path d="M-10-44V-62L0-72 10-62V-44Z" fill="#8ac4b3"/><circle cy="-57" r="4" fill="#fff4cf"/>':'<path d="M11-43V-55L18-52V-38" fill="#b57664"/>'}</g>`;
 const tree=(x:number,y:number)=>`<g transform="translate(${x} ${y})"><ellipse cy="3" rx="13" ry="5" fill="#a0c68b"/><path d="M-2 2V-15H3V2" fill="#99765c"/><g class="village-leaves"><circle cy="-22" r="13" fill="#74b981"/><circle cx="-5" cy="-28" r="8" fill="#a1d69a"/></g></g>`;
 return `<svg class="village-art" viewBox="0 0 320 156" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="156" rx="18" fill="#eaf6ff"/><circle cx="269" cy="26" r="14" fill="#ffe8a6"/><g class="village-cloud" fill="#fff" opacity=".85"><ellipse cx="56" cy="24" rx="23" ry="7"/><circle cx="48" cy="20" r="9"/><circle cx="62" cy="17" r="11"/></g><path d="M21 88 159 27 299 88 160 150Z" fill="#a1c98c"/><path d="M21 81 159 20 299 81 160 142Z" fill="#d9f3c5"/><path d="M55 96 222 45 239 52 76 105Z" fill="#f5dfba"/><ellipse cx="155" cy="120" rx="22" ry="9" fill="#8cd3e0"/><path class="village-ripple" d="M143 120q7-4 14 0" fill="none" stroke="#e6fbff" stroke-width="2" stroke-linecap="round"/><g fill="#f5b4b8"><circle cx="95" cy="112" r="3"/><circle cx="100" cy="115" r="2"/><circle cx="230" cy="67" r="3"/></g><g fill="#fff5ce"><circle cx="110" cy="108" r="2"/><circle cx="250" cy="95" r="3"/></g>${level>=1?tree(102,59)+tree(242,87):''}${house(128,89,'#fff1d4','#dc8f85')}${level>=2?house(195,65,'#f9e3a3','#779fca',1.05,'school'):''}${level>=3?house(204,106,'#e3d8f3','#a28ac7',.85,'library'):''}${level>=4?house(80,77,'#f5e9ce','#79b2a8',.85,'hall'):''}${level>=5?'<g transform="translate(112 116)"><ellipse rx="16" ry="7" fill="#92c785"/><g fill="#ed8f9e"><circle cx="-7" cy="-4" r="4"/><circle cx="7" cy="-5" r="4"/></g><circle cy="-9" r="4" fill="#f0c86e"/></g>':''}${level>=6?'<g transform="translate(250 72)"><path d="M-12 0V-23L0-39 12-23V0Z" fill="#e5bf82"/><circle cy="-24" r="5" fill="#bce5eb"/><path d="M0-30V-48M-17-39H17M-12-51L12-27M12-51L-12-27" stroke="#94795c" stroke-width="3"/></g>':''}${level>=7?'<g transform="translate(54 86)"><path d="M-8 0H8L5-38H-5Z" fill="#e5d5f4"/><path d="M-10-38L0-49 10-38Z" fill="#8079bd"/><circle cy="-31" r="5" fill="#fff0ac"/></g>':''}${level>=8?'<g transform="translate(158 51)"><path d="M-9 0V-21H9V0Z" fill="#eed8a4"/><path d="M-12-21L0-36 12-21Z" fill="#b581ab"/><path d="M0-36V-49L13-45 0-41Z" fill="#eb9f79"/></g>':''}</svg>`;
}
function chooseQuestion(){
 const all=questionsFor(state.grade);
 const themed=expedition&&selected?all.filter(q=>q.subject!==selected?.subject):all;
 const available=themed.length?themed:all;
 const due=available.filter(q=>isDue(state.reviews[q.skillId],new Date()));
 const eligible=due.length?due:available;
 const alternatives=eligible.filter(q=>q.id!==selected?.id);
 const pool=alternatives.length?alternatives:eligible;
 selected=pool[Math.floor(Math.random()*pool.length)]??null;
 tutor=selected?beginTutor(selected.id,selected.prompt):null;
 usedHint=false;gardenCount=0;gardenGroups=1;gardenOpen=false;feedback='';finished=false;
}
function render(){
 if(!root)return;
 const active=document.activeElement as HTMLElement|null;
 const focusId=active?.id;
 const focusAnswer=active?.getAttribute('data-answer');
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
 const stages=[{stars:0,name:'새싹 마을',scene:'🏡'},{stars:2,name:'푸른 마을',scene:'🏡 🌳'},{stars:4,name:'배움 마을',scene:'🏡 🌳 🏫'},{stars:8,name:'지식 마을',scene:'🏡 🌳 🏫 📚'},{stars:12,name:'탐험 도시',scene:'🏘️ 🌳 🏫 📚 🏰'},{stars:18,name:'정원 도시'},{stars:24,name:'발명 도시'},{stars:30,name:'별빛 도시'},{stars:36,name:'지식 왕국'}];
 const stageIndex=stages.reduce((index,stage,i)=>state.stars>=stage.stars?i:index,0);
 const grew=renderedVillageStage!==undefined&&stageIndex>renderedVillageStage;
 renderedVillageStage=stageIndex;
 const worldOpen=root.querySelector<HTMLDetailsElement>('#world-map')?.open??false;
 selectedRegion=Math.min(selectedRegion,stageIndex);
 const builderOpen=root.querySelector<HTMLDetailsElement>('#village-builder')?.open??false;
 const journalOpen=root.querySelector<HTMLDetailsElement>('#village-journal')?.open??false;
 selectedBuilding=Math.min(selectedBuilding,stageIndex);
 const discoveries=['작은 집','푸른 나무','학교','도서관','시청','꽃 정원','풍차','별빛 탑','왕국 깃발'];
 const stories=["작은 집에 첫 책이 도착했어요. 배움의 모험이 시작됩니다.","나무 아래에서 친구들과 이야기를 나눠요.","학교가 문을 열었어요. 서로의 질문에서 배워요.","도서관에 지혜가 쌓여요. 새로운 이야기를 찾아봐요.","탐험 도시에서 친구들이 힘을 모아 길을 만들어요.","꽃 정원에서 작은 씨앗이 자라듯 지식도 자라요.","풍차를 보며 어떻게 움직이는지 함께 생각해요.","별빛 탑에서 밤하늘의 궁금증을 발견해요.","지식 왕국이 완성됐어요. 배운 것을 친구들과 나눠요."];
 const stage=stages[stageIndex];
 const nextStage=stages[stageIndex+1];
 const existingFeedback=root.querySelector<HTMLElement>('.feedback');
 const existingLand=root.querySelector<HTMLElement>('.land');
 const preserveLand=existingLand?.dataset.stage===String(stageIndex);
 root.innerHTML=`<div class="shell"><header><div class="eyebrow">STUDY GAME · P0-B</div><h1>🌱 지식 탐험대</h1><p>스스로 생각하고 마을을 키워요!</p></header>
 <section class="toolbar"><label for="grade">학년 선택</label><select id="grade">${[1,2,3].map(n=>`<option value="${n}" ${state.grade===n?'selected':''}>${n}학년</option>`).join('')}</select><button type="button" id="sound" aria-pressed="${soundEnabled}" aria-label="효과음" class="hint">${soundEnabled?'🔊 소리 켜짐':'🔇 소리 꺼짐'}</button><span class="stars" aria-live="polite">⭐ ${state.stars}개</span></section>
 <section class="village" aria-label="마을 성장"><div class="land${grew?' village-grown':''}" data-stage="${stageIndex}" aria-hidden="true">${preserveLand?'':villageArt(stageIndex)}</div><strong>Lv. ${stageIndex+1} · ${stage.name}</strong><div class="village-progress">${nextStage?`<label for="village-growth">다음 성장까지 별 ${nextStage.stars-state.stars}개</label><progress id="village-growth" value="${state.stars-stage.stars}" max="${nextStage.stars-stage.stars}"></progress>`:'모든 마을 성장 단계 달성!'}</div><small>학습 기록: ${answered}문제 · 정답 ${success}개</small></section>
 <section class="quiz" aria-label="개념별 학습 현황"><h2>📚 오늘의 복습 · ${dueCount}개 개념</h2>${progress.map(p=>`<div class="concept-progress"><label for="mastery-${escape(p.concept.id)}">${p.concept.subject==='math'?'🔢':'📖'} ${escape(p.concept.title)} · 숙련도 ${p.level}/5</label><progress id="mastery-${escape(p.concept.id)}" value="${p.level}" max="5"></progress><small>${p.due?'지금 복습':'다음 복습 '+escape(new Date(p.dueAt!).toLocaleDateString('ko-KR'))}</small><span class="mastery-goal">${p.level>=5?'🏅 숙련 목표 달성 · 꾸준히 복습해요!':`🎯 다음 목표: 숙련도 ${p.level+1}/5 · ${p.due?'복습에 도전해요.':'다음 복습 때 다시 도전해요.'}`}</span></div>`).join('')}</section>
 ${q?`<section class="quiz quest" aria-label="학습 퀘스트"><div class="quest-kicker">오늘의 탐험</div><button type="button" class="hint expedition-toggle" id="expedition-toggle" aria-pressed="${expedition}">${expedition?'🧭 종합 탐험 종료':'🧭 종합 탐험 시작'}</button>${expedition?`<p class="expedition-status" role="status">종합 탐험 · ${Math.min(expeditionCompleted,3)}/3 · ${expeditionCompleted>=3?'탐험 완료! 쉬어도 좋아요.':'다음 문제부터 수학과 국어를 번갈아 풀어요.'}</p>`:''}<div class="session-goal"><label for="session-goal-progress">이번 학습 목표 · ${Math.min(sessionCompleted,sessionGoal)}/${sessionGoal}문제</label><progress id="session-goal-progress" value="${Math.min(sessionCompleted,sessionGoal)}" max="${sessionGoal}"></progress><small>${sessionCompleted>=sessionGoal?'🎉 목표 달성! 더 풀거나 쉬어도 좋아요.':'틀려도 끝까지 도전하면 인정돼요.'}</small></div><div class="subject">${q.subject==='math'?'🔢 수학':'📖 국어'} · ${state.grade}학년 · ${escape(concept?.title??'학습')}</div><h2 id="question-heading" tabindex="-1">${escape(q.prompt)}</h2>
 ${q.subject==='math'?`<details id="number-garden" class="number-garden" ${gardenOpen?'open':''}><summary id="garden-toggle">🍎 숫자 정원 · 직접 세어 보기</summary><p>사과를 더하거나 빼면서 답을 생각해요. 정답은 아래에서 선택해요.</p><div class="garden-apples garden-groups" aria-hidden="true">${Array.from({length:gardenGroups},(_,i)=>`<span>${'🍎'.repeat(Math.floor(gardenCount/gardenGroups)+(i<gardenCount%gardenGroups?1:0))||'빈 바구니'}</span>`).join('')}</div>${state.grade>1?`<div class="garden-controls"><button type="button" id="group-minus" ${finished||gardenGroups===1?'disabled':''}>바구니 −</button><button type="button" id="group-plus" ${finished||gardenGroups===9?'disabled':''}>바구니 ＋</button></div><p>바구니 ${gardenGroups}개 · 사과를 골고루 나눠요.</p>`:''}<p role="status">사과 ${gardenCount}개</p><div class="garden-controls"><button type="button" id="garden-minus" ${finished||gardenCount===0?'disabled':''}>− 1</button><button type="button" id="garden-plus" ${finished||gardenCount>=36?'disabled':''}>＋ 1</button><button type="button" id="garden-clear" ${finished||gardenCount===0?'disabled':''}>비우기</button></div></details>`:''}
 ${q.skillId==='korean.word.1'?'<div class="word-forest-banner"><span aria-hidden="true">🌳 🍃 🌳</span><strong>낱말의 숲</strong><small>문제에 맞는 낱말을 찾아요.</small></div>':''}
 ${q.skillId==='korean.sentence.2'||q.skillId==='korean.reading.3'?`<div class="sentence-bridge-banner"><span aria-hidden="true">🌳 🌉 🌳</span><strong>${q.skillId==='korean.sentence.2'?'문장의 다리 · 까닭 찾기':'문장의 다리 · 중심 내용 찾기'}</strong><small>문장을 읽고 알맞은 답을 골라요.</small></div>`:''}
 <div class="choices${q.skillId==='korean.sentence.2'||q.skillId==='korean.reading.3'?' sentence-bridge':''}${q.skillId==='korean.word.1'?' word-forest':''}">${q.choices.map((c,i)=>`<button class="choice" data-answer="${i}" ${finished?'disabled':''}>${q.skillId==='korean.word.1'?'<span class="word-leaf" aria-hidden="true">🍃</span>':''}${escape(c)}</button>`).join('')}</div>
 <button class="hint" id="hint" ${finished?'disabled':''}>💡 생각 도우미</button>
 <p class="feedback" role="status" aria-live="polite">${escape(feedback)}</p>
 ${storageConflict?'<button type="button" id="reload-records" class="hint">최신 학습 기록 불러오기</button>':''}
 <button id="next" class="next">${finished?'다음 문제로 →':'다른 문제 풀기 ↻'}</button></section>`:''}
 <details id="village-journal" class="quiz village-journal" ${journalOpen?'open':''}><summary id="journal-toggle">마을 수집 도감 · ${stageIndex+1}/${stages.length}</summary><ol>${stages.map((item,i)=>`<li class="${i<=stageIndex?'discovered':'undiscovered'}"><strong>${i<=stageIndex?'✓ '+discoveries[i]:'🔒 '+discoveries[i]}</strong><small>${item.name} · 별 ${item.stars}개</small><p class="discovery-story">${i<=stageIndex?stories[i]:'마을이 성장하면 새 이야기가 열려요.'}</p><button type="button" class="building-select" id="building-${i}" data-building="${i}" aria-pressed="${selectedBuilding===i}" ${i>stageIndex?'disabled':''}>${i>stageIndex?'잠김':selectedBuilding===i?'선택됨':'선택하기'}</button></li>`).join('')}</ol></details>
 <details id="village-builder" class="quiz village-builder" ${builderOpen?'open':''}><summary id="builder-toggle">🏡 나만의 마을 꾸미기</summary><div class="builder-palette" aria-label="건축물 선택">${discoveries.slice(0,stageIndex+1).map((name,i)=>`<button type="button" id="palette-${i}" data-building="${i}" aria-pressed="${selectedBuilding===i}" class="building-select"><span aria-hidden="true">${buildingIcons[i]}</span> ${name}</button>`).join('')}</div><p class="building-preview" role="status">선택한 건축물: ${discoveries[selectedBuilding]} · 빈 칸이나 건물을 눌러 배치해요.</p><div class="building-slots" aria-label="나만의 마을">${villageSlots.map((building,i)=>`<button type="button" id="slot-${i}" data-slot="${i}" ${!villageSnapshot.readable?'disabled':''} aria-label="${i+1}번 자리: ${building===null?'빈 칸':discoveries[building]}">${building===null?'＋':building>stageIndex?'🔒':buildingIcons[building]}<small>${building===null?'빈 칸':discoveries[building]}</small></button>`).join('')}</div><div class="building-actions"><button type="button" id="building-undo" ${previousSlots&&villageSnapshot.readable?'':'disabled'}>되돌리기</button><button type="button" id="building-reset" ${!villageSnapshot.readable||villageSlots.every(v=>v===null)?'disabled':''}>비우기</button></div><p class="building-preview" role="status">${escape(villageNotice)}</p></details>
 <details id="world-map" class="quiz world-map" ${worldOpen?'open':''}><summary id="world-toggle">🗺️ 지식 왕국 탐험 · ${stageIndex+1}/${stages.length}</summary><ol class="world-route">${stages.map((item,i)=>`<li><button type="button" id="region-${i}" data-region="${i}" aria-pressed="${selectedRegion===i}" ${i>stageIndex?'disabled':''}><span aria-hidden="true">${i>stageIndex?'🔒':buildingIcons[i]}</span><strong>${item.name}</strong><small>${i>stageIndex?'별 '+item.stars+'개에 해금':'탐험 가능'}</small></button></li>`).join('')}</ol><div class="region-story" role="status"><strong>${stages[selectedRegion].name}</strong><p>${stories[selectedRegion]}</p></div></details>
 <footer>기록은 이 브라우저에 저장돼요 · 복습은 학습 개념별로 진행돼요</footer></div>`;
 const shell=root.querySelector<HTMLElement>('.shell')!;
 const toolbar=shell.querySelector<HTMLElement>('.toolbar')!;
 const views=[
  {id:'learn',label:'📚 학습',items:['.quest','.quiz[aria-label="개념별 학습 현황"]']},
  {id:'village',label:'🏡 마을',items:['.village','#village-journal','#village-builder']},
  {id:'explore',label:'🧭 탐험',items:['#world-map']}
 ] as const;
 const nav=document.createElement('nav');
 nav.className='mobile-nav';
 nav.setAttribute('aria-label','주요 화면');
 for(const view of views){
  const panel=document.createElement('section');
  panel.id='view-'+view.id;
  panel.className='view-panel';
  panel.hidden=activeView!==view.id;
  panel.setAttribute('aria-label',view.label);
  const heading=document.createElement('h2');
  heading.className='view-heading';
  heading.tabIndex=-1;
  heading.textContent=view.label;
  panel.append(heading);
  for(const selector of view.items){
   const item=shell.querySelector(selector);
   if(item)panel.append(item);
  }
  shell.querySelector('footer')?.before(panel);
  const button=document.createElement('button');
  button.type='button';
  button.className='mobile-nav-button';
  button.dataset.view=view.id;
  button.setAttribute('aria-controls',panel.id);
  button.setAttribute('aria-pressed',String(activeView===view.id));
  button.textContent=view.label;
  nav.append(button);
 }
 shell.querySelector('footer')?.before(nav);
 const explorePanel=shell.querySelector<HTMLElement>('#view-explore');
 if(explorePanel){
  const mission=sortMissions[sortCareer]??sortMissions.free;
  const result=checkSortSession(mission,sortSession);
  const activity=document.createElement('section');
  activity.className='quiz sort-activity';
  activity.setAttribute('aria-label','물건 분류 미니게임');
  activity.innerHTML=`<h3>🧺 ${escape(mission.title)}</h3><p>${escape(mission.instruction)}</p>
   <label for="sort-career">탐험 역할 미리보기</label>
   <select id="sort-career">${Object.keys(sortMissions).map(key=>`<option value="${key}" ${key===sortCareer?'selected':''}>${escape(({doctor:'의사',lawyer:'변호사',police:'경찰',rescue:'119 구조대원',scientist:'과학자',president:'대통령',astronaut:'우주비행사',teacher:'교사',free:'자유 탐험'} as Record<string,string>)[key])}</option>`).join('')}</select>
   <p role="status" aria-live="polite" class="sort-status">${result.completed?'🎉 분류 성공!':`정답 ${result.correct}/${result.total} · ${escape(sortFeedback||'물건을 선택한 다음 분류함을 누르세요.')}`}</p>
   <div class="sort-items" aria-label="분류할 물건">${mission.items.map(item=>`<button type="button" data-sort-item="${escape(item.id)}" aria-pressed="${sortSelectedItem===item.id}" ${result.completed?'disabled':''}>${escape(item.label)}${sortSession.placements[item.id]?' · '+escape(sortSession.placements[item.id]):''}</button>`).join('')}</div>
   <div class="sort-groups" aria-label="분류함">${mission.groups.map(group=>`<button type="button" data-sort-group="${escape(group)}" ${result.completed?'disabled':''}>${escape(group)}</button>`).join('')}</div>
   <button type="button" id="sort-reset">다시 분류하기</button>`;
  explorePanel.append(activity);
  const puzzleMission=puzzleForGrade(puzzleMissions[puzzleCareer]??puzzleMissions.free,state.grade);
  if(puzzleSession.missionId!==puzzleMission.id){puzzleSession=createPuzzleSession(puzzleMission);puzzleNotice='';}
  const puzzle=document.createElement('section');
  puzzle.className='quiz puzzle-activity';
  puzzle.setAttribute('aria-label','조각 퍼즐 미니게임');
  puzzle.innerHTML=`<h3>🧩 ${escape(puzzleMission.title)}</h3><p>${escape(puzzleMission.instruction)}</p>
   <label for="puzzle-career">퍼즐 이야기 선택</label>
   <select id="puzzle-career">${Object.keys(puzzleMissions).map(key=>`<option value="${key}" ${key===puzzleCareer?'selected':''}>${escape(({free:'자유 탐험',doctor:'의사',lawyer:'변호사',police:'경찰',rescue:'119 구조대원',scientist:'과학자',president:'대통령',astronaut:'우주비행사',teacher:'교사'} as Record<string,string>)[key])}</option>`).join('')}</select>
   <p role="status" aria-live="polite" class="puzzle-status">${puzzleSession.completed?'🎉 퍼즐 완성!':escape(puzzleNotice||(puzzleSession.selected?'첫 번째 조각을 골랐어요. 바꿀 조각을 선택해 주세요.':'조각 두 개를 차례로 눌러 위치를 바꿔 보세요.'))}</p>
   <div class="puzzle-tiles" aria-label="순서를 맞출 퍼즐 조각">${puzzleSession.order.map((id,i)=>{const tile=puzzleMission.tiles.find(item=>item.id===id)!;return `<button type="button" data-puzzle-tile="${escape(id)}" aria-pressed="${puzzleSession.selected===id}" ${puzzleSession.completed?'disabled':''} aria-label="${i+1}번째 자리, ${escape(tile.label)}">${escape(tile.label)}</button>`;}).join('')}</div>
   <button type="button" id="puzzle-reset">퍼즐 다시 시작</button>`;
  explorePanel.append(puzzle);
  const hiddenMission=hiddenMissions[hiddenCareer]??hiddenMissions.free;
  const hidden=document.createElement('section');
  hidden.className='quiz hidden-activity';
  hidden.setAttribute('aria-label','물건 찾기 미니게임');
  hidden.innerHTML=`<h3>🔎 ${escape(hiddenMission.title)}</h3><p>${escape(hiddenMission.scene)}에서 물건 세 개를 찾아 보세요.</p>
   <label for="hidden-career">찾기 장소 선택</label>
   <select id="hidden-career">${Object.keys(hiddenMissions).map(key=>`<option value="${key}" ${key===hiddenCareer?'selected':''}>${escape(({free:'자유 탐험',doctor:'의사',lawyer:'변호사',police:'경찰',rescue:'119 구조대원',scientist:'과학자',president:'대통령',astronaut:'우주비행사',teacher:'교사'} as Record<string,string>)[key])}</option>`).join('')}</select>
   <p class="hidden-status" role="status" aria-live="polite">${hiddenSession.completed?'🎉 물건을 모두 찾았어요!':`찾은 물건 ${hiddenSession.found.length}/${hiddenMission.objects.length}`}</p>
   <div class="hidden-scene" aria-label="물건 찾기 활동 공간">${hiddenMission.objects.map((object,i)=>`<button type="button" data-hidden-object="${escape(object.id)}" ${hiddenSession.found.includes(object.id)?'disabled':''} aria-label="${escape(object.label)} 찾기" class="hidden-object hidden-object-${i}">${hiddenSession.found.includes(object.id)?'✓ ':''}${escape(object.label)}</button>`).join('')}</div>
   <button type="button" id="hidden-hint" aria-expanded="${hiddenHint}">힌트 ${hiddenHint?'닫기':'보기'}</button>
   ${hiddenHint?`<ul class="hidden-hints">${hiddenMission.objects.filter(object=>!hiddenSession.found.includes(object.id)).map(object=>`<li>${escape(object.hint)}</li>`).join('')}</ul>`:''}
   <button type="button" id="hidden-reset">다시 찾기</button>`;
  explorePanel.append(hidden);
 }
 const recovery=shell.querySelector('#reload-records');
 if(recovery)toolbar.after(recovery);
 if(preserveLand&&existingLand){existingLand.classList.remove('village-grown');root.querySelector('.land')?.replaceWith(existingLand);}
 if(existingFeedback){
  const replacement=root.querySelector<HTMLElement>('.feedback');
  if(replacement){replacement.replaceWith(existingFeedback);existingFeedback.textContent=feedback;}
 }
 if(focusId==='hint'&&finished)root.querySelector<HTMLButtonElement>('#next')?.focus();
 else if(focusAnswer!==null&&focusAnswer!==undefined&&finished)root.querySelector<HTMLButtonElement>('#next')?.focus();
 else if(focusAnswer!==null&&focusAnswer!==undefined)root.querySelector<HTMLButtonElement>(`[data-answer="${focusAnswer}"]`)?.focus();
 else if(focusId)root.querySelector<HTMLElement>(`#${focusId}`)?.focus();
 root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  if(saving)return;
  const view=button.dataset.view;
  if(view!=='learn'&&view!=='village'&&view!=='explore')return;
  activeView=view;
  root.querySelectorAll<HTMLElement>('.view-panel').forEach(panel=>{panel.hidden=panel.id!=='view-'+view;});
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.view===view)));
  root.querySelector<HTMLElement>('#view-'+view+' .view-heading')?.focus();
 }));
 root.querySelector<HTMLSelectElement>('#sort-career')?.addEventListener('change',event=>{
  if(saving)return;
  const key=(event.target as HTMLSelectElement).value;
  if(!Object.prototype.hasOwnProperty.call(sortMissions,key))return;
  sortCareer=key;
  sortFeedback='';
  sortSession=createSortSession(sortMissions[key]);
  sortSelectedItem=null;
  render();
  root.querySelector<HTMLSelectElement>('#sort-career')?.focus();
 });
 root.querySelectorAll<HTMLButtonElement>('[data-sort-item]').forEach(button=>button.addEventListener('click',()=>{
  if(saving||sortSession.completed)return;
  sortSelectedItem=button.dataset.sortItem??null;
  sortFeedback='분류함을 골라 주세요.';
  render();
  root.querySelector<HTMLButtonElement>(`[data-sort-item="${sortSelectedItem}"]`)?.focus();
 }));
 root.querySelectorAll<HTMLButtonElement>('[data-sort-group]').forEach(button=>button.addEventListener('click',()=>{
  if(saving||!sortSelectedItem||sortSession.completed)return;
  const group=button.dataset.sortGroup??'';
  const selected=sortMissions[sortCareer].items.find(item=>item.id===sortSelectedItem);
  sortFeedback=selected?.group===group?'잘했어요! 다음 물건도 분류해 보세요.':'다시 생각해 보세요. 다른 분류함으로 옮길 수 있어요.';
  sortSession=placeSortItem(sortMissions[sortCareer],sortSession,sortSelectedItem,group);
  sortSelectedItem=null;
  render();
  if(sortSession.completed)root.querySelector<HTMLButtonElement>('#sort-reset')?.focus();
  else root.querySelectorAll<HTMLButtonElement>('[data-sort-group]').forEach(bin=>{if(bin.dataset.sortGroup===group)bin.focus();});
 }));
 root.querySelector('#sort-reset')?.addEventListener('click',()=>{
  if(saving)return;
  sortSession=createSortSession(sortMissions[sortCareer]);
  sortSelectedItem=null;
  sortFeedback='';
  render();
  root.querySelector<HTMLButtonElement>('#sort-reset')?.focus();
 });
 root.querySelector<HTMLSelectElement>('#puzzle-career')?.addEventListener('change',event=>{
  if(saving)return;
  const key=(event.target as HTMLSelectElement).value;
  if(!Object.prototype.hasOwnProperty.call(puzzleMissions,key))return;
  puzzleCareer=key;
  puzzleNotice='';
  puzzleSession=createPuzzleSession(puzzleForGrade(puzzleMissions[key],state.grade));
  render();
  root.querySelector<HTMLSelectElement>('#puzzle-career')?.focus();
 });
 root.querySelectorAll<HTMLButtonElement>('[data-puzzle-tile]').forEach(button=>button.addEventListener('click',()=>{
  if(saving||puzzleSession.completed)return;
  const id=button.dataset.puzzleTile??'';
  const previousSelected=puzzleSession.selected;
  puzzleSession=selectPuzzleTile(puzzleForGrade(puzzleMissions[puzzleCareer],state.grade),puzzleSession,id);
  puzzleNotice=previousSelected&&previousSelected!==id?'조각 위치를 바꿨어요. 순서를 살펴보세요.':'';
  render();
  if(puzzleSession.completed)root.querySelector<HTMLButtonElement>('#puzzle-reset')?.focus();
  else root.querySelectorAll<HTMLButtonElement>('[data-puzzle-tile]').forEach(tile=>{if(tile.dataset.puzzleTile===id)tile.focus();});
 }));
 root.querySelector('#puzzle-reset')?.addEventListener('click',()=>{
  if(saving)return;
  puzzleSession=createPuzzleSession(puzzleForGrade(puzzleMissions[puzzleCareer],state.grade));
  puzzleNotice='';
  render();
  root.querySelector<HTMLButtonElement>('#puzzle-reset')?.focus();
 });
 root.querySelector<HTMLSelectElement>('#hidden-career')?.addEventListener('change',event=>{
  if(saving)return;
  const key=(event.target as HTMLSelectElement).value;
  if(!Object.prototype.hasOwnProperty.call(hiddenMissions,key))return;
  hiddenCareer=key;
  hiddenSession=createHiddenSession(hiddenMissions[key]);
  hiddenHint=false;
  render();
  root.querySelector<HTMLSelectElement>('#hidden-career')?.focus();
 });
 root.querySelectorAll<HTMLButtonElement>('[data-hidden-object]').forEach(button=>button.addEventListener('click',()=>{
  if(saving||hiddenSession.completed)return;
  hiddenSession=findHiddenObject(hiddenMissions[hiddenCareer],hiddenSession,button.dataset.hiddenObject??'');
  render();
  if(hiddenSession.completed)root.querySelector<HTMLButtonElement>('#hidden-reset')?.focus();
  else root.querySelector<HTMLButtonElement>('#hidden-hint')?.focus();
 }));
 root.querySelector('#hidden-hint')?.addEventListener('click',()=>{
  hiddenHint=!hiddenHint;
  render();
  root.querySelector<HTMLButtonElement>('#hidden-hint')?.focus();
 });
 root.querySelector('#hidden-reset')?.addEventListener('click',()=>{
  if(saving)return;
  hiddenSession=createHiddenSession(hiddenMissions[hiddenCareer]);
  hiddenHint=false;
  render();
  root.querySelector<HTMLButtonElement>('#hidden-reset')?.focus();
 });
 root.querySelector('#sound')?.addEventListener('click',()=>{soundEnabled=!soundEnabled;if(soundEnabled){try{unlockAudio();sound('click-soft');}catch{/* optional audio */}}render();});
 root.querySelector<HTMLSelectElement>('#grade')?.addEventListener('change',async e=>{
  if(saving){(e.target as HTMLSelectElement).value=String(state.grade);return;}
  saving=true;
  const n=Number((e.target as HTMLSelectElement).value) as Grade;
  const next={...state,grade:n};
  const result=await saveStateSafely(localStorage,state,next,navigator.locks);
  saving=false;
  if(result==='saved'){state=next;expeditionCompleted=0;selected=null;chooseQuestion();}
  else {if(result==='conflict')storageConflict=true;feedback=result==='conflict'?'다른 탭에서 기록이 변경됐어요. 새로고침 후 다시 시도해 주세요.':'저장에 실패했어요. 브라우저 저장 공간을 확인해 주세요.';}
  render();
 });
 root.querySelector('#hint')?.addEventListener('click',()=>{if(!q||finished||saving)return;usedHint=true;feedback=q.hint;render();});
 root.querySelectorAll<HTMLButtonElement>('[data-region]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.region);if(saving||!Number.isInteger(index)||index<0||index>stageIndex)return;selectedRegion=index;render();}));
 root.querySelectorAll<HTMLButtonElement>('[data-building]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.building);if(saving||!Number.isInteger(index)||index<0||index>stageIndex)return;selectedBuilding=index;const fromJournal=button.id.startsWith('building-');if(fromJournal){const panel=root.querySelector<HTMLDetailsElement>('#village-builder');if(panel)panel.open=true;}render();if(fromJournal)root.querySelector<HTMLElement>('#slot-0')?.focus();}));
 root.querySelectorAll<HTMLButtonElement>('[data-slot]').forEach(button=>button.addEventListener('click',async()=>{const i=Number(button.dataset.slot);if(saving||!Number.isInteger(i)||i<0||i>=villageSlots.length||selectedBuilding>stageIndex||villageSlots[i]===selectedBuilding)return;const next=[...villageSlots];next[i]=selectedBuilding;await commitVillage(next,[...villageSlots]);}));
 root.querySelector('#building-undo')?.addEventListener('click',async()=>{if(saving||!previousSlots)return;if(await commitVillage(previousSlots,null))root.querySelector<HTMLElement>('#slot-0')?.focus();});
 root.querySelector('#building-reset')?.addEventListener('click',async()=>{if(saving||villageSlots.every(v=>v===null))return;if(await commitVillage(emptySlots(),[...villageSlots]))root.querySelector<HTMLElement>('#building-undo')?.focus();});
 for(const [id,delta] of [['group-minus',-1],['group-plus',1]] as const){
  root.querySelector('#'+id)?.addEventListener('click',()=>{if(saving||finished||q?.subject!=='math')return;gardenOpen=true;gardenGroups=Math.max(1,Math.min(9,gardenGroups+delta));render();});
 }
 root.querySelector('#number-garden')?.addEventListener('toggle',()=>{gardenOpen=root.querySelector<HTMLDetailsElement>('#number-garden')?.open??false;});
 for(const [id,delta] of [['garden-plus',1],['garden-minus',-1],['garden-clear',0]] as const){
  root.querySelector('#'+id)?.addEventListener('click',()=>{if(saving||finished||q?.subject!=='math')return;gardenOpen=true;gardenCount=delta===0?0:Math.max(0,Math.min(36,gardenCount+delta));render();});
 }
 root.querySelector('#expedition-toggle')?.addEventListener('click',()=>{if(saving)return;expedition=!expedition;expeditionCompleted=0;render();});
 root.querySelector('#reload-records')?.addEventListener('click',()=>{if(!saving)window.location.reload();});
 root.querySelector('#next')?.addEventListener('click',()=>{if(saving)return;chooseQuestion();render();root.querySelector<HTMLElement>('#question-heading')?.focus();});
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
   if(result==='conflict')storageConflict=true;
   if(saved){state=next;sessionCompleted++;if(expedition)expeditionCompleted++;sound(gained?'coin':'confirm');}
   saving=false;
   finished=true;
   feedback=saved?'정답이에요! '+(gained?'⭐ 별 1개 획득! ':'')+step.message:result==='conflict'?'다른 탭에서 기록이 변경됐어요. 새로고침 후 다시 풀어 주세요.':'정답이지만 저장에 실패했어요. 별과 학습 기록은 반영되지 않았어요.';
  }else if(step.showExplanation){
   saving=true;
   const next=recordAttempt(state,q,answer,true,new Date());
   const result=await saveStateSafely(localStorage,state,next,navigator.locks);
   const saved=result==='saved';
   if(result==='conflict')storageConflict=true;
   if(saved){state=next;sessionCompleted++;if(expedition)expeditionCompleted++;}
   saving=false;
   finished=true;
   feedback=saved?step.message:result==='conflict'?'다른 탭에서 기록이 변경됐어요. 새로고침 후 다시 풀어 주세요.':'저장에 실패했어요. 학습 기록은 반영되지 않았어요.';
  }else{
   usedHint=true;
   sound('click-soft');
   feedback=step.message;
  }
  render();
 }));
}
window.addEventListener('storage',event=>{
 if(event.key===VILLAGE_KEY||event.key===null){villageSnapshot={...villageSnapshot,readable:false};previousSlots=null;villageNotice='다른 탭에서 건축 기록이 변경됐어요. 새로고침해 주세요.';render();}
 if(event.key===STORAGE_KEY||event.key===null){
  storageConflict=true;
  feedback='다른 탭에서 학습 기록이 변경됐어요. 최신 기록을 불러오려면 새로고침해 주세요.';
  render();
 }
});
render();
