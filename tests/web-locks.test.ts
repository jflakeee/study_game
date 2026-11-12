import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../src/learning.ts';
import {saveStateSafely,loadState} from '../src/storage.ts';
function memory(){const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};}
test('Web Locks serializes two competing saves',async()=>{
 const storage=memory(),expected=createState();
 let queue=Promise.resolve();
 const locks={request:(_name:string,_opts:unknown,fn:()=>unknown)=>{
  const task=queue.then(()=>fn());queue=task.then(()=>undefined);return task;
 }} as unknown as Pick<LockManager,'request'>;
 const [a,b]=await Promise.all([saveStateSafely(storage,expected,{...expected,stars:1},locks),saveStateSafely(storage,expected,{...expected,stars:2},locks)]);
 assert.equal(a,'saved');assert.equal(b,'conflict');assert.equal(loadState(storage).stars,1);
});
test('without Web Locks uses optimistic guard',async()=>{
 const storage=memory(),expected=createState();
 assert.equal(await saveStateSafely(storage,expected,{...expected,stars:1}),'saved');
 assert.equal(await saveStateSafely(storage,expected,{...expected,stars:2}),'conflict');
});
test('lock failure does not save',async()=>{
 const storage=memory(),expected=createState();
 const locks={request:async()=>{throw Error('denied');}} as unknown as Pick<LockManager,'request'>;
 assert.equal(await saveStateSafely(storage,expected,{...expected,stars:1},locks),'error');
 assert.equal(loadState(storage).stars,0);
});
