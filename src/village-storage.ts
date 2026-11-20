export const VILLAGE_KEY='study-game-village-v1';
export type Slots=(number|null)[];
export function emptySlots():Slots{return Array(6).fill(null);}
export function validSlots(value:unknown):value is Slots{return Array.isArray(value)&&value.length===6&&value.every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<9));}
export function loadVillage(storage:Storage):{raw:string|null;slots:Slots;readable:boolean}{
 try{const raw=storage.getItem(VILLAGE_KEY);if(raw===null)return {raw,slots:emptySlots(),readable:true};const parsed=JSON.parse(raw);return {raw,slots:parsed?.version===1&&validSlots(parsed.slots)?parsed.slots:emptySlots(),readable:parsed?.version===1&&validSlots(parsed.slots)};}catch{return {raw:null,slots:emptySlots(),readable:false};}
}
export async function saveVillage(storage:Storage,expected:string|null,slots:Slots,locks?:LockManager):Promise<{raw:string;ok:true}|{ok:false}>{
 if(!validSlots(slots))return {ok:false};
 const write=()=>{try{if(storage.getItem(VILLAGE_KEY)!==expected)return {ok:false} as const;const raw=JSON.stringify({version:1,slots});storage.setItem(VILLAGE_KEY,raw);return {raw,ok:true} as const;}catch{return {ok:false} as const;}};
 try{return locks?await locks.request(VILLAGE_KEY,write):write();}catch{return {ok:false};}
}
