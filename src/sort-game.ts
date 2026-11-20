export type SortItem={id:string;label:string;group:string};
export type SortMission={id:string;title:string;instruction:string;groups:readonly string[];items:readonly SortItem[]};
export type SortSession={missionId:string;placements:Record<string,string>;completed:boolean};
export function createSortSession(mission:SortMission):SortSession{
 validateMission(mission);
 return {missionId:mission.id,placements:{},completed:false};
}
export function validateMission(mission:SortMission):void{
 if(!mission.id||!mission.title||mission.groups.length<2||mission.groups.length>4||mission.items.length<3||mission.items.length>6)throw Error('Invalid sort mission');
 const groups=new Set(mission.groups);
 if(groups.size!==mission.groups.length||mission.groups.some(group=>!group))throw Error('Invalid groups');
 const ids=new Set<string>();
 for(const item of mission.items){
  if(!item.id||!item.label||ids.has(item.id)||!groups.has(item.group))throw Error('Invalid sort item');
  ids.add(item.id);
 }
}
export function placeSortItem(mission:SortMission,session:SortSession,itemId:string,group:string):SortSession{
 validateMission(mission);
 if(session.missionId!==mission.id||session.completed) return session;
 if(!mission.items.some(item=>item.id===itemId)||!mission.groups.includes(group))return session;
 const placements={...session.placements,[itemId]:group};
 return {...session,placements,completed:mission.items.every(item=>placements[item.id]===item.group)};
}
export function checkSortSession(mission:SortMission,session:SortSession):{placed:number;correct:number;total:number;completed:boolean}{
 validateMission(mission);
 if(session.missionId!==mission.id)throw Error('Mismatched mission');
 const correct=mission.items.filter(item=>session.placements[item.id]===item.group).length;
 return {placed:mission.items.filter(item=>session.placements[item.id]!==undefined).length,correct,total:mission.items.length,completed:correct===mission.items.length};
}
export const sortMissions:Record<string,SortMission>={
 doctor:{id:'sort-doctor',title:'건강센터 물건 정리',instruction:'진료 도구와 책을 구분해요.',groups:['진료 도구','책'],items:[{id:'stethoscope',label:'청진기',group:'진료 도구'},{id:'thermometer',label:'체온계',group:'진료 도구'},{id:'story',label:'동화책',group:'책'}]},
 lawyer:{id:'sort-lawyer',title:'상담실 물건 정리',instruction:'문서와 필기구를 구분해요.',groups:['문서','필기구'],items:[{id:'letter',label:'편지',group:'문서'},{id:'report',label:'보고서',group:'문서'},{id:'pencil',label:'연필',group:'필기구'}]},
 police:{id:'sort-police',title:'안전 표지 정리',instruction:'안전 표지와 생활 물건을 구분해요.',groups:['안전 표지','생활 물건'],items:[{id:'crosswalk',label:'횡단보도 표지',group:'안전 표지'},{id:'stop',label:'정지 표지',group:'안전 표지'},{id:'cup',label:'컵',group:'생활 물건'}]},
 rescue:{id:'sort-rescue',title:'안전교육 준비',instruction:'안전 장비와 학습 자료를 구분해요.',groups:['안전 장비','학습 자료'],items:[{id:'helmet',label:'안전모',group:'안전 장비'},{id:'gloves',label:'보호 장갑',group:'안전 장비'},{id:'guide',label:'안전 안내책',group:'학습 자료'}]},
 scientist:{id:'sort-scientist',title:'연구실 물건 분류',instruction:'관찰 도구와 식물을 구분해요.',groups:['관찰 도구','식물'],items:[{id:'lens',label:'돋보기',group:'관찰 도구'},{id:'ruler',label:'자',group:'관찰 도구'},{id:'seed',label:'씨앗',group:'식물'}]},
 president:{id:'sort-president',title:'마을 회의 준비',instruction:'회의 자료와 필기구를 구분해요.',groups:['회의 자료','필기구'],items:[{id:'agenda',label:'회의 안건',group:'회의 자료'},{id:'suggestion',label:'주민 제안서',group:'회의 자료'},{id:'pen',label:'볼펜',group:'필기구'}]},
 astronaut:{id:'sort-astronaut',title:'우주 기지 물품 정리',instruction:'탐사 도구와 식량을 구분해요.',groups:['탐사 도구','식량'],items:[{id:'camera',label:'탐사 카메라',group:'탐사 도구'},{id:'scanner',label:'관측 장비',group:'탐사 도구'},{id:'food',label:'우주 식량',group:'식량'}]},
 teacher:{id:'sort-teacher',title:'교실 물건 정리',instruction:'책과 학용품을 구분해요.',groups:['책','학용품'],items:[{id:'mathbook',label:'수학책',group:'책'},{id:'storybook',label:'동화책',group:'책'},{id:'eraser',label:'지우개',group:'학용품'}]},
 free:{id:'sort-free',title:'마을 물건 정리',instruction:'식물과 도구를 구분해요.',groups:['식물','도구'],items:[{id:'flower',label:'꽃',group:'식물'},{id:'tree',label:'나무',group:'식물'},{id:'shovel',label:'삽',group:'도구'}]}
};
