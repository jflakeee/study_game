import {createState,type GameState,type Grade} from './learning.ts';
export const STORAGE_KEY='study-game-state-v1';
export function parseState(raw:string|null):GameState|null {
  if(!raw)return null;
  try { const value:unknown=JSON.parse(raw); if(!value||typeof value!=='object')return null;
    const s=value as Partial<GameState>;
    if(s.version!==1||![1,2,3].includes(s.grade as number)||!Array.isArray(s.attempts)||!s.reviews||typeof s.reviews!=='object'||Array.isArray(s.reviews)||!Number.isSafeInteger(s.stars)||s.stars!<0)return null;
    if(!s.attempts.every(a=>a&&typeof a.questionId==='string'&&typeof a.skillId==='string'&&typeof a.correct==='boolean'&&typeof a.usedHint==='boolean'&&typeof a.at==='string'))return null;
    if(!Object.values(s.reviews).every(r=>r&&typeof r.skillId==='string'&&Number.isSafeInteger(r.repetitions)&&Number.isSafeInteger(r.intervalDays)&&typeof r.dueAt==='string'&&['again','hard','good','easy'].includes(r.lastRating)))return null;
    return s as GameState;
  } catch{return null;}
}
export function loadState(storage:Pick<Storage,'getItem'>,grade:Grade=1):GameState { try{return parseState(storage.getItem(STORAGE_KEY))??createState(grade);}catch{return createState(grade);} }
export function saveState(storage:Pick<Storage,'setItem'>,state:GameState):boolean {try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}