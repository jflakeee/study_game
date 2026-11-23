import type {Question} from './learning.ts';

export type VisualMathScene = {kind:'add'|'subtract';initial:number;change:number;answer:number};

// Use the actual equation, never infer operations from narrative prose.
export function visualMathScene(question:Question):VisualMathScene|null {
  if(question.subject!=='math'||question.grade!==1)return null;
  const add=/^(\d+) \+ (\d+) = \?$/.exec(question.prompt);
  if(add){
    const initial=Number(add[1]),change=Number(add[2]),answer=initial+change;
    return initial>0&&change>0&&answer<=40&&question.answer===String(answer)
      ?{kind:'add',initial,change,answer}:null;
  }
  const subtract=/^(\d+) - (\d+) = \?$/.exec(question.prompt);
  if(subtract){
    const initial=Number(subtract[1]),change=Number(subtract[2]),answer=initial-change;
    return initial>0&&change>0&&answer>=0&&initial<=40&&question.answer===String(answer)
      ?{kind:'subtract',initial,change,answer}:null;
  }
  return null;
}

export function renderVisualMathScene(scene:VisualMathScene):string {
  const core='<svg viewBox="0 0 48 56" aria-hidden="true" focusable="false"><path d="M24 8V2" stroke="#77512d" stroke-width="4" stroke-linecap="round"/><path d="M24 7Q32 0 38 7Q32 13 24 7" fill="#57a34b"/><path d="M7 13Q24 6 41 13L35 21Q30 25 35 31L41 43Q24 49 7 43L13 31Q18 25 13 21Z" fill="#fff0b8" stroke="#bd6b39" stroke-width="2"/><path d="M7 13Q24 6 41 13L35 21Q24 17 13 21Z M7 43Q24 49 41 43L35 37Q24 42 13 37Z" fill="#e34239"/><ellipse cx="21" cy="28" rx="2" ry="3" fill="#754727"/><ellipse cx="28" cy="28" rx="2" ry="3" fill="#754727"/></svg>';
  const dots=(count:number,eaten=false)=>Array.from({length:count},()=>`<span class="visual-dot${eaten?' eaten':''}" aria-hidden="true">${eaten?core:'🍎'}</span>`).join('');
  const label=scene.kind==='add'?`${scene.initial} 더하기 ${scene.change}`:`${scene.initial} 중 ${scene.change} 빼기`;
  if(scene.kind==='subtract'){
    return `<div class="visual-math" role="img" aria-label="${label}"><div class="visual-group">${dots(scene.answer)}${dots(scene.change,true)}</div><span class="visual-operator" aria-hidden="true">= ?</span></div>`;
  }
  return `<div class="visual-math" role="img" aria-label="${label}"><div class="visual-group">${dots(scene.initial)}</div><span class="visual-operator" aria-hidden="true">+</span><div class="visual-group">${dots(scene.change)}</div><span class="visual-operator" aria-hidden="true">= ?</span></div>`;
}
