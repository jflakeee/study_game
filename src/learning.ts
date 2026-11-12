import {scheduleReview} from './review.ts';
export type Grade = 1 | 2 | 3;
export type Subject = 'math' | 'korean';
export type Answer = string;
export interface Question { id: string; grade: Grade; subject: Subject; skillId: string; prompt: string; choices: readonly string[]; answer: Answer; hint: string; explanation: string }
export interface Attempt { questionId: string; skillId: string; correct: boolean; usedHint: boolean; at: string }
export type Rating = 'again' | 'hard' | 'good' | 'easy';
export interface Review { skillId: string; repetitions: number; intervalDays: number; dueAt: string; lastRating: Rating }
export interface GameState { version: 1; grade: Grade; attempts: Attempt[]; reviews: Record<string, Review>; stars: number }
export const questions: Question[] = [
  {id:'m1-add',grade:1,subject:'math',skillId:'math.add.10',prompt:'4 + 3 = ?',choices:['6','7','8'],answer:'7',hint:'4부터 세 칸 더 세어 보세요.',explanation:'4에서 5, 6, 7로 세 칸 이동해요.'},
  {id:'k1-word',grade:1,subject:'korean',skillId:'korean.word.1',prompt:'동물 이름을 골라요.',choices:['사과','토끼','책상'],answer:'토끼',hint:'깡충깡충 뛰는 동물을 떠올려요.',explanation:'토끼는 동물이에요.'},
  {id:'m2-mul',grade:2,subject:'math',skillId:'math.mul.2',prompt:'3 × 4 = ?',choices:['7','12','14'],answer:'12',hint:'3을 네 번 더해 보세요.',explanation:'3+3+3+3=12예요.'},
  {id:'k2-sentence',grade:2,subject:'korean',skillId:'korean.sentence.2',prompt:'"비가 와서 우산을 썼다." 우산을 쓴 까닭은?',choices:['비가 와서','더워서','배가 고파서'],answer:'비가 와서',hint:'문장 앞부분에서 이유를 찾아요.',explanation:'비가 오는 것이 우산을 쓴 이유예요.'},
  {id:'m3-div',grade:3,subject:'math',skillId:'math.div.3',prompt:'15 ÷ 3 = ?',choices:['3','5','6'],answer:'5',hint:'15개를 세 묶음으로 똑같이 나눠 보세요.',explanation:'한 묶음에 5개씩 들어가요.'},
  {id:'k3-main',grade:3,subject:'korean',skillId:'korean.reading.3',prompt:'"민지는 매일 나무에 물을 주었다. 나무가 쑥쑥 자랐다." 중심 내용은?',choices:['나무 돌보기','시장 구경','축구 경기'],answer:'나무 돌보기',hint:'두 문장에 공통으로 나오는 대상을 생각해요.',explanation:'민지가 나무를 돌보고 자라는 모습을 이야기해요.'}
];

// P0-B curriculum variants: independent question IDs within each concept.
export const variantQuestions: Question[] = [
 {id:'m1-add-2',grade:1,subject:'math',skillId:'math.add.10',prompt:'6 + 2 = ?',choices:['7','8','9'],answer:'8',hint:'6부터 두 칸 앞으로 세어 보세요.',explanation:'6 다음은 7, 그 다음은 8이에요.'},
 {id:'m1-add-3',grade:1,subject:'math',skillId:'math.add.10',prompt:'5 + 4 = ?',choices:['8','9','10'],answer:'9',hint:'5에 4를 더해 보세요.',explanation:'5+4=9예요.'},
 {id:'k1-word-2',grade:1,subject:'korean',skillId:'korean.word.1',prompt:'과일 이름을 골라요.',choices:['바나나','의자','연필'],answer:'바나나',hint:'먹을 수 있는 달콤한 열매를 골라요.',explanation:'바나나는 과일이에요.'},
 {id:'k1-word-3',grade:1,subject:'korean',skillId:'korean.word.1',prompt:'탈것을 골라요.',choices:['자동차','강아지','수박'],answer:'자동차',hint:'사람을 태우고 길 위를 달려요.',explanation:'자동차는 탈것이에요.'},
 {id:'m2-mul-2',grade:2,subject:'math',skillId:'math.mul.2',prompt:'2 × 5 = ?',choices:['7','10','12'],answer:'10',hint:'2를 다섯 번 더해 보세요.',explanation:'2+2+2+2+2=10이에요.'},
 {id:'m2-mul-3',grade:2,subject:'math',skillId:'math.mul.2',prompt:'4 × 3 = ?',choices:['7','12','14'],answer:'12',hint:'4가 세 묶음 있어요.',explanation:'4+4+4=12예요.'},
 {id:'k2-sentence-2',grade:2,subject:'korean',skillId:'korean.sentence.2',prompt:'"배가 고파서 밥을 먹었다." 밥을 먹은 까닭은?',choices:['배가 고파서','잠이 와서','비가 와서'],answer:'배가 고파서',hint:'왜 밥을 먹었는지 문장 앞을 봐요.',explanation:'배가 고픈 것이 밥을 먹은 이유예요.'},
 {id:'k2-sentence-3',grade:2,subject:'korean',skillId:'korean.sentence.2',prompt:'"추워서 외투를 입었다." 외투를 입은 까닭은?',choices:['더워서','추워서','심심해서'],answer:'추워서',hint:'외투를 입기 전의 상태를 찾아요.',explanation:'추웠기 때문에 외투를 입었어요.'},
 {id:'m3-div-2',grade:3,subject:'math',skillId:'math.div.3',prompt:'24 ÷ 4 = ?',choices:['5','6','8'],answer:'6',hint:'4가 몇 번 모이면 24일까요?',explanation:'4×6=24이므로 24÷4=6이에요.'},
 {id:'m3-div-3',grade:3,subject:'math',skillId:'math.div.3',prompt:'18 ÷ 6 = ?',choices:['2','3','4'],answer:'3',hint:'6씩 묶으면 몇 묶음일까요?',explanation:'6×3=18이므로 18÷6=3이에요.'},
 {id:'k3-main-2',grade:3,subject:'korean',skillId:'korean.reading.3',prompt:'"우리는 공원을 청소했다. 쓰레기를 주워 깨끗하게 만들었다." 중심 내용은?',choices:['공원 청소','산책 준비','장보기'],answer:'공원 청소',hint:'두 문장이 모두 설명하는 활동을 찾아요.',explanation:'공원을 깨끗하게 청소한 이야기예요.'},
 {id:'k3-main-3',grade:3,subject:'korean',skillId:'korean.reading.3',prompt:'"지수는 씨앗을 심었다. 매일 물을 주며 싹을 기다렸다." 중심 내용은?',choices:['씨앗 기르기','도서관 방문','운동회'],answer:'씨앗 기르기',hint:'씨앗을 심고 무엇을 했나요?',explanation:'씨앗을 심고 돌보는 내용이에요.'}
];

export function checkAnswer(question: Question, response: string): boolean { return response.normalize('NFC').trim() === question.answer.normalize('NFC').trim(); }
export function ratingFor(correct: boolean, usedHint: boolean): Rating { return !correct ? 'again' : usedHint ? 'hard' : 'good'; }
export function createState(grade: Grade = 1): GameState { return {version:1,grade,attempts:[],reviews:{},stars:0}; }
export function recordAttempt(state: GameState, question: Question, response: string, usedHint: boolean, at: Date): GameState {
  const correct=checkAnswer(question,response);
  const rating=ratingFor(correct,usedHint);
  const reviews={...state.reviews,[question.skillId]:scheduleReview(state.reviews[question.skillId],question.skillId,rating,at)};
  const firstIndependentCorrect=correct&&!usedHint&&!state.attempts.some(a=>a.questionId===question.id&&a.correct&&!a.usedHint);
  return {...state,attempts:[...state.attempts,{questionId:question.id,skillId:question.skillId,correct,usedHint,at:at.toISOString()}],reviews,stars:state.stars+(firstIndependentCorrect?1:0)};
}
export function questionsFor(grade: Grade, subject?: Subject): Question[] { return [...questions,...variantQuestions].filter(q=>q.grade===grade && (!subject || q.subject===subject)); }