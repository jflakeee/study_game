import test from 'node:test';
import assert from 'node:assert/strict';
import {VILLAGE_KEY,emptySlots,validSlots,loadVillage,saveVillage} from '../src/village-storage.ts';
function fixture(){
 const map=new Map<string,string>();let fail=false;
 const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{if(fail)throw Error('quota');map.set(k,v);}} as Storage;
 return {storage,map,fail:()=>{fail=true;}};
}
test('empty and invalid slots',()=>{assert.equal(validSlots(emptySlots()),true);for(const x of [null,[0],Array(6).fill(9),Array(6).fill(-1),Array(6).fill('0')])assert.equal(validSlots(x),false);});
test('placement reload and reset preserve learning data',async()=>{const {storage}=fixture();storage.setItem('study-game-state-v1','unchanged');const slots=emptySlots();slots[0]=2;const saved=await saveVillage(storage,null,slots);assert.ok(saved.ok);assert.deepEqual(loadVillage(storage).slots,slots);assert.ok((await saveVillage(storage,saved.raw,emptySlots())).ok);assert.deepEqual(loadVillage(storage).slots,emptySlots());assert.equal(storage.getItem('study-game-state-v1'),'unchanged');});
test('stale tab cannot overwrite current layout',async()=>{const {storage}=fixture();const a=emptySlots();a[0]=1;assert.ok((await saveVillage(storage,null,a)).ok);assert.equal((await saveVillage(storage,null,emptySlots())).ok,false);assert.deepEqual(loadVillage(storage).slots,a);});
test('quota failure preserves previous data',async()=>{const f=fixture();const a=emptySlots();a[0]=1;const saved=await saveVillage(f.storage,null,a);assert.ok(saved.ok);f.fail();assert.equal((await saveVillage(f.storage,saved.raw,emptySlots())).ok,false);assert.deepEqual(loadVillage(f.storage).slots,a);});
test('malformed and future version are unreadable',()=>{const {storage}=fixture();for(const raw of ['{',JSON.stringify({version:2,slots:emptySlots()})]){storage.setItem(VILLAGE_KEY,raw);assert.equal(loadVillage(storage).readable,false);assert.equal(storage.getItem(VILLAGE_KEY),raw);}});
