export type HiddenObject={id:string;label:string;hint:string};
export type HiddenMission={id:string;title:string;scene:string;objects:readonly HiddenObject[]};
export type HiddenSession={missionId:string;found:string[];completed:boolean};
export function validateHiddenMission(mission:HiddenMission):void{
 if(!mission.id||!mission.title||!mission.scene||mission.objects.length<3||mission.objects.length>5)throw Error('Invalid hidden object mission');
 const ids=new Set<string>();
 for(const object of mission.objects){if(!object.id||!object.label||!object.hint||ids.has(object.id))throw Error('Invalid hidden object');ids.add(object.id);}
}
export function createHiddenSession(mission:HiddenMission):HiddenSession{
 validateHiddenMission(mission);
 return {missionId:mission.id,found:[],completed:false};
}
export function findHiddenObject(mission:HiddenMission,session:HiddenSession,id:string):HiddenSession{
 if(session.missionId!==mission.id||session.completed||session.found.includes(id)||!mission.objects.some(object=>object.id===id))return session;
 const found=[...session.found,id];
 return {missionId:mission.id,found,completed:found.length===mission.objects.length};
}
const objects=(labels:readonly [string,string,string][]):HiddenObject[]=>labels.map(([id,label,hint])=>({id,label,hint}));
export const hiddenMissions:Record<string,HiddenMission>={
 free:{id:'free-hidden',title:'숲속 물건 찾기',scene:'숲속 쉼터',objects:objects([['leaf','🍃 나뭇잎','나무 아래를 살펴보세요.'],['flower','🌼 꽃','꽃밭을 살펴보세요.'],['stone','🪨 돌','길가를 살펴보세요.']])},
 doctor:{id:'doctor-hidden',title:'건강센터 물건 찾기',scene:'건강센터',objects:objects([['bandage','🩹 반창고','구급함을 살펴보세요.'],['thermometer','🌡️ 체온계','검사 도구함을 살펴보세요.'],['notebook','📒 기록장','책상 위를 살펴보세요.']])},
 lawyer:{id:'lawyer-hidden',title:'상담실 물건 찾기',scene:'상담실',objects:objects([['paper','📄 문서','서류함을 살펴보세요.'],['pen','🖊️ 펜','책상 위를 살펴보세요.'],['folder','📁 폴더','책꽂이를 살펴보세요.']])},
 police:{id:'police-hidden',title:'안전 마을 물건 찾기',scene:'마을 안전 교육장',objects:objects([['sign','🚸 안전 표지','길가를 살펴보세요.'],['vest','🦺 안전 조끼','안전함을 살펴보세요.'],['cone','🚧 안전 울타리','길목을 살펴보세요.']])},
 rescue:{id:'rescue-hidden',title:'119 안전교육 물건 찾기',scene:'안전교육장',objects:objects([['helmet','⛑️ 안전모','장비 선반을 살펴보세요.'],['light','🔦 손전등','비상용품함을 살펴보세요.'],['exit','🚪 비상구 표시','출입문 위를 살펴보세요.']])},
 scientist:{id:'scientist-hidden',title:'관찰실 물건 찾기',scene:'과학 관찰실',objects:objects([['glass','🔍 돋보기','관찰대 위를 살펴보세요.'],['plant','🪴 화분','창가를 살펴보세요.'],['book','📓 관찰 기록장','책상 위를 살펴보세요.']])},
 president:{id:'president-hidden',title:'마을 회의 물건 찾기',scene:'주민 회의실',objects:objects([['board','📋 의견판','벽면을 살펴보세요.'],['map','🗺️ 마을 지도','탁자를 살펴보세요.'],['pencil','✏️ 연필','문구함을 살펴보세요.']])},
 astronaut:{id:'astronaut-hidden',title:'우주선 물건 찾기',scene:'우주선 준비실',objects:objects([['star','⭐ 별 지도','관측대 옆을 살펴보세요.'],['radio','📻 통신기','조종석을 살펴보세요.'],['glove','🧤 장갑','장비함을 살펴보세요.']])},
 teacher:{id:'teacher-hidden',title:'교실 물건 찾기',scene:'교실',objects:objects([['book','📚 책','책꽂이를 살펴보세요.'],['pencil','✏️ 연필','필통을 살펴보세요.'],['clock','🕒 시계','벽 위를 살펴보세요.']])}
};
