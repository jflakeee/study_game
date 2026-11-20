export type PuzzleTile={id:string;label:string};
export type PuzzleMission={id:string;title:string;instruction:string;tiles:readonly PuzzleTile[]};
export type PuzzleSession={missionId:string;order:string[];selected:string|null;completed:boolean};
export function validatePuzzleMission(mission:PuzzleMission):void{
 if(!mission.id||!mission.title||mission.tiles.length<4||mission.tiles.length>9)throw Error('Invalid puzzle mission');
 const ids=new Set<string>();
 for(const tile of mission.tiles){if(!tile.id||!tile.label||ids.has(tile.id))throw Error('Invalid puzzle tile');ids.add(tile.id);}
}
export function createPuzzleSession(mission:PuzzleMission):PuzzleSession{
 validatePuzzleMission(mission);
 const order=mission.tiles.map(tile=>tile.id).reverse();
 return {missionId:mission.id,order,selected:null,completed:false};
}
export function selectPuzzleTile(mission:PuzzleMission,session:PuzzleSession,id:string):PuzzleSession{
 if(session.missionId!==mission.id||session.completed||!session.order.includes(id))return session;
 if(session.selected===null)return {...session,selected:id};
 if(session.selected===id)return {...session,selected:null};
 const order=[...session.order];
 const a=order.indexOf(session.selected),b=order.indexOf(id);
 [order[a],order[b]]=[order[b],order[a]];
 const completed=order.every((tile,i)=>tile===mission.tiles[i].id);
 return {...session,order,selected:null,completed};
}
export const puzzleMissions:Record<string,PuzzleMission>={
 free:{id:'free-puzzle',title:'숲속 이야기 퍼즐',instruction:'그림 조각 대신 이야기 순서 조각을 맞춰 보세요.',tiles:[{id:'seed',label:'① 씨앗 심기'},{id:'water',label:'② 물 주기'},{id:'sprout',label:'③ 싹이 나기'},{id:'flower',label:'④ 꽃 피기'}]},
 doctor:{id:'doctor-puzzle',title:'건강센터 퍼즐',instruction:'건강센터에서 할 일을 순서대로 맞춰 보세요.',tiles:[{id:'welcome',label:'① 인사하기'},{id:'listen',label:'② 이야기 듣기'},{id:'check',label:'③ 살펴보기'},{id:'guide',label:'④ 건강 안내'}]},
 astronaut:{id:'astronaut-puzzle',title:'우주 탐사 퍼즐',instruction:'우주 탐사 준비 순서를 맞춰 보세요.',tiles:[{id:'plan',label:'① 탐사 계획'},{id:'pack',label:'② 물품 챙기기'},{id:'check',label:'③ 장비 확인'},{id:'launch',label:'④ 출발하기'}]},
 teacher:{id:'teacher-puzzle',title:'교실 정리 퍼즐',instruction:'수업 준비 순서를 맞춰 보세요.',tiles:[{id:'desk',label:'① 책상 정리'},{id:'book',label:'② 책 준비'},{id:'greet',label:'③ 인사하기'},{id:'learn',label:'④ 공부 시작'}]}
};
