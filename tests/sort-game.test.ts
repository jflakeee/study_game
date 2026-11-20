import assert from 'node:assert/strict';
import test from 'node:test';
import {sortMissions,createSortSession,placeSortItem,checkSortSession,validateMission} from '../src/sort-game.ts';
for(const [career,mission] of Object.entries(sortMissions)){
 test('sort mission '+career+' completes once and does not mutate original',()=>{
  const initial=createSortSession(mission);
  assert.equal(initial.completed,false);
  let session=initial;
  for(const item of mission.items)session=placeSortItem(mission,session,item.id,item.group);
  assert.equal(session.completed,true);
  assert.equal(checkSortSession(mission,session).correct,mission.items.length);
  assert.deepEqual(initial.placements,{});
  assert.equal(placeSortItem(mission,session,mission.items[0].id,'wrong'),session);
 });
 test('sort mission '+career+' incorrect placement can be corrected',()=>{
  const item=mission.items[0];
  const wrong=mission.groups.find(group=>group!==item.group)!;
  let session=placeSortItem(mission,createSortSession(mission),item.id,wrong);
  assert.equal(checkSortSession(mission,session).correct,0);
  session=placeSortItem(mission,session,item.id,item.group);
  assert.equal(checkSortSession(mission,session).correct,1);
  assert.equal(session.completed,false);
 });
}
test('invalid missions rejected',()=>{
 assert.throws(()=>validateMission({...sortMissions.free,groups:['식물','식물']}));
 assert.throws(()=>validateMission({...sortMissions.free,items:[...sortMissions.free.items,sortMissions.free.items[0]]}));
});
