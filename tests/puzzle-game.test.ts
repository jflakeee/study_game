import assert from 'node:assert/strict';
import test from 'node:test';
import {puzzleMissions,createPuzzleSession,selectPuzzleTile,validatePuzzleMission,puzzleForGrade} from '../src/puzzle-game.ts';
for(const mission of Object.values(puzzleMissions)){
 test(mission.id+' solves by selecting two tiles to swap',()=>{
  const initial=createPuzzleSession(mission);
  assert.equal(initial.completed,false);
  assert.deepEqual(initial.order,mission.tiles.map(tile=>tile.id).reverse());
  let session=initial;
  for(let i=0;i<mission.tiles.length;i++){
   const desired=mission.tiles[i].id;
   if(session.order[i]===desired)continue;
   session=selectPuzzleTile(mission,session,session.order[i]);
   session=selectPuzzleTile(mission,session,desired);
  }
  assert.equal(session.completed,true);
  assert.deepEqual(session.order,mission.tiles.map(tile=>tile.id));
  assert.equal(selectPuzzleTile(mission,session,session.order[0]),session);
  assert.equal(initial.completed,false);
 });
 test(mission.id+' ignores invalid tiles and toggles selection',()=>{
  const initial=createPuzzleSession(mission);
  assert.equal(selectPuzzleTile(mission,initial,'unknown'),initial);
  const chosen=selectPuzzleTile(mission,initial,initial.order[0]);
  assert.equal(chosen.selected,initial.order[0]);
  assert.equal(selectPuzzleTile(mission,chosen,initial.order[0]).selected,null);
 });
}
test('rejects invalid puzzle definitions',()=>{
 assert.throws(()=>validatePuzzleMission({...puzzleMissions.free,tiles:[]}));
 assert.throws(()=>validatePuzzleMission({...puzzleMissions.free,tiles:[...puzzleMissions.free.tiles.slice(0,3),puzzleMissions.free.tiles[0]]}));
});

for(const mission of Object.values(puzzleMissions)){
 test(mission.id+' adapts to grade 1/2/3 without mutating canonical tiles',()=>{
  for(const [grade,count] of [[1,4],[2,6],[3,9]] as const){
   const adapted=puzzleForGrade(mission,grade);
   assert.equal(adapted.tiles.length,count);
   assert.equal(createPuzzleSession(adapted).order.length,count);
   validatePuzzleMission(adapted);
  }
  assert.equal(mission.tiles.length,4);
 });
}
