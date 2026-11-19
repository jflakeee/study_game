import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,recordAttempt,questions} from '../src/learning.ts';
import {STORAGE_KEY,saveStateIfUnchanged} from '../src/storage.ts';
test('deleted learning history cannot be resurrected by stale tab',()=>{
 const map=new Map<string,string>();
 const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};
 const initial=createState();
 const q=questions[0];
 const learned=recordAttempt(initial,q,q.answer,false,new Date('2026-11-20T00:00:00Z'));
 assert.equal(saveStateIfUnchanged(storage,initial,learned),'saved');
 map.delete(STORAGE_KEY);
 assert.equal(saveStateIfUnchanged(storage,learned,learned),'conflict');
 assert.equal(storage.getItem(STORAGE_KEY),null);
 assert.equal(saveStateIfUnchanged(storage,initial,learned),'saved');
});
