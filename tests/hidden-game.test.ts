import assert from 'node:assert/strict';
import test from 'node:test';
import {hiddenMissions,createHiddenSession,findHiddenObject,validateHiddenMission} from '../src/hidden-game.ts';
for(const [career,mission] of Object.entries(hiddenMissions)){
 test('hidden object '+career+' completes without mutating initial state',()=>{
  const initial=createHiddenSession(mission);
  let session=initial;
  for(const object of mission.objects){
   const previous=session;
   session=findHiddenObject(mission,session,object.id);
   assert.equal(session.found.length,previous.found.length+1);
   assert.equal(findHiddenObject(mission,session,object.id),session);
  }
  assert.equal(session.completed,true);
  assert.deepEqual(initial.found,[]);
  assert.equal(findHiddenObject(mission,session,mission.objects[0].id),session);
 });
 test('hidden object '+career+' ignores invalid item or mismatched mission',()=>{
  const initial=createHiddenSession(mission);
  assert.equal(findHiddenObject(mission,initial,'unknown'),initial);
  assert.equal(findHiddenObject(mission,{...initial,missionId:'other'},mission.objects[0].id).found.length,0);
 });
}
test('hidden object missions require unique IDs and usable hints',()=>{
 assert.throws(()=>validateHiddenMission({...hiddenMissions.free,objects:[]}));
 assert.throws(()=>validateHiddenMission({...hiddenMissions.free,objects:[...hiddenMissions.free.objects.slice(0,2),hiddenMissions.free.objects[0]]}));
});
