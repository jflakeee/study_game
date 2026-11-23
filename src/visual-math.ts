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
  const dots=(count:number,removed=false)=>Array.from({length:count},()=>`<span class="visual-dot${removed?' removed':''}" aria-hidden="true">●</span>`).join('');
  const first=scene.kind==='add'?dots(scene.initial):dots(scene.answer);
  const second=scene.kind==='add'?dots(scene.change):dots(scene.change,true);
  const label=scene.kind==='add'?`${scene.initial} 더하기 ${scene.change}`:`${scene.initial} 빼기 ${scene.change}`;
  return `<div class="visual-math" role="img" aria-label="${label}"><div class="visual-group">${first}</div><span class="visual-operator" aria-hidden="true">${scene.kind==='add'?'+':'−'}</span><div class="visual-group">${second}</div><span class="visual-operator" aria-hidden="true">= ?</span></div>`;
}
