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
export function puzzleForGrade(mission:PuzzleMission,grade:1|2|3):PuzzleMission{
 validatePuzzleMission(mission);
 if(grade===1)return mission;
 const extras:PuzzleTile[]=[
  {id:'bonus-review',label:'⑤ 순서 다시 살펴보기'},
  {id:'bonus-explain',label:'⑥ 친구에게 설명하기'},
  {id:'bonus-note',label:'⑦ 배운 점 적기'},
  {id:'bonus-share',label:'⑧ 배운 점 나누기'},
  {id:'bonus-finish',label:'⑨ 마무리하기'}
 ];
 return {...mission,id:mission.id+'-grade-'+grade,tiles:[...mission.tiles,...extras.slice(0,grade===2?2:5)]};
}
export const puzzleMissions:Record<string,PuzzleMission>={
 free:{id:'free-puzzle',title:'숲속 이야기 퍼즐',instruction:'그림 조각 대신 이야기 순서 조각을 맞춰 보세요.',tiles:[{id:'seed',label:'① 씨앗 심기'},{id:'water',label:'② 물 주기'},{id:'sprout',label:'③ 싹이 나기'},{id:'flower',label:'④ 꽃 피기'}]},
 doctor:{id:'doctor-puzzle',title:'건강센터 퍼즐',instruction:'건강센터에서 할 일을 순서대로 맞춰 보세요.',tiles:[{id:'welcome',label:'① 인사하기'},{id:'listen',label:'② 이야기 듣기'},{id:'check',label:'③ 살펴보기'},{id:'guide',label:'④ 건강 안내'}]},
 astronaut:{id:'astronaut-puzzle',title:'우주 탐사 퍼즐',instruction:'우주 탐사 준비 순서를 맞춰 보세요.',tiles:[{id:'plan',label:'① 탐사 계획'},{id:'pack',label:'② 물품 챙기기'},{id:'check',label:'③ 장비 확인'},{id:'launch',label:'④ 출발하기'}]},
 lawyer:{id:'lawyer-puzzle',title:'공정한 대화 퍼즐',instruction:'서로의 이야기를 듣고 공정하게 정리하는 순서를 맞춰 보세요.',tiles:[{id:'greet',label:'① 인사하기'},{id:'listen',label:'② 양쪽 이야기 듣기'},{id:'facts',label:'③ 사실 확인하기'},{id:'fair',label:'④ 공정하게 정리하기'}]},
 police:{id:'police-puzzle',title:'안전한 길 퍼즐',instruction:'안전하게 길을 건너는 순서를 맞춰 보세요.',tiles:[{id:'stop',label:'① 횡단보도 앞 멈추기'},{id:'signal',label:'② 신호 확인하기'},{id:'look',label:'③ 좌우 살피기'},{id:'cross',label:'④ 천천히 건너기'}]},
 rescue:{id:'rescue-puzzle',title:'119 안전교육 퍼즐',instruction:'안전교육을 준비하는 순서를 맞춰 보세요.',tiles:[{id:'greet',label:'① 안전교육 시작'},{id:'notice',label:'② 위험 표시 알아보기'},{id:'practice',label:'③ 대피 방법 연습'},{id:'finish',label:'④ 배운 내용 확인'}]},
 scientist:{id:'scientist-puzzle',title:'과학 관찰 퍼즐',instruction:'식물을 관찰하는 순서를 맞춰 보세요.',tiles:[{id:'question',label:'① 궁금한 점 찾기'},{id:'observe',label:'② 자세히 관찰하기'},{id:'record',label:'③ 관찰 결과 적기'},{id:'share',label:'④ 발견한 점 나누기'}]},
 president:{id:'president-puzzle',title:'우리 마을 회의 퍼즐',instruction:'마을을 더 좋게 만드는 회의 순서를 맞춰 보세요.',tiles:[{id:'gather',label:'① 주민 의견 모으기'},{id:'listen',label:'② 서로 이야기 듣기'},{id:'plan',label:'③ 함께 계획 세우기'},{id:'check',label:'④ 결과 돌아보기'}]},
 teacher:{id:'teacher-puzzle',title:'교실 정리 퍼즐',instruction:'수업 준비 순서를 맞춰 보세요.',tiles:[{id:'desk',label:'① 책상 정리'},{id:'book',label:'② 책 준비'},{id:'greet',label:'③ 인사하기'},{id:'learn',label:'④ 공부 시작'}]}
};
