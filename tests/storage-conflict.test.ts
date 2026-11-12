import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../src/learning.ts';
import {saveStateIfUnchanged,saveState,loadState} from '../src/storage.ts';
test('stale tab cannot overwrite newer saved state',()=>{
 const data=new Map<string,string>();const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};
 const original=createState();assert.equal(saveState(storage,original),true);
 const tabA=loadState(storage);const tabB=loadState(storage);
 assert.equal(saveStateIfUnchanged(storage,tabA,{...tabA,stars:1}),'saved');
 assert.equal(saveStateIfUnchanged(storage,tabB,{...tabB,stars:5}),'conflict');
 assert.equal(loadState(storage).stars,1);
});
test('storage failure leaves persisted data untouched',()=>{
 const state=createState();const storage={getItem:(_k:string)=>JSON.stringify(state),setItem:(_k:string,_v:string)=>{throw Error('quota');}};
 assert.equal(saveStateIfUnchanged(storage,state,{...state,stars:1}),'error');
});
test('first save works on empty storage',()=>{
 const data=new Map<string,string>();const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};
 assert.equal(saveStateIfUnchanged(storage,createState(),createState(2)),'saved');
 assert.equal(loadState(storage).grade,2);
});
