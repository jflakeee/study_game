import type {Rating,Review} from './learning.ts';
import {scheduleReview} from './review.ts';
export interface ReviewSignal {correct:boolean;usedHint:boolean;responseMs:number}
export function ratingFromSignal(s:ReviewSignal):Rating{
 if(!Number.isFinite(s.responseMs)||s.responseMs<0)throw Error('Invalid response time');
 if(!s.correct)return 'again';
 if(s.usedHint)return 'hard';
 return s.responseMs>=45000?'hard':s.responseMs<=7000?'easy':'good';
}
export function scheduleFromSignal(previous:Review|undefined,conceptId:string,signal:ReviewSignal,now:Date):Review{
 return scheduleReview(previous,conceptId,ratingFromSignal(signal),now);
}