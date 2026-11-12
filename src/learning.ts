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
export function checkAnswer(question: Question, response: string): boolean { return response.normalize('NFC').trim() === question.answer.normalize('NFC').trim(); }
export function ratingFor(correct: boolean, usedHint: boolean): Rating { return !correct ? 'again' : usedHint ? 'hard' : 'good'; }
export function createState(grade: Grade = 1): GameState { return {version:1,grade,attempts:[],reviews:{},stars:0}; }
export function recordAttempt(state: GameState, question: Question, response: string, usedHint: boolean, at: Date): GameState {
  const correct=checkAnswer(question,response);
  const rating=ratingFor(correct,usedHint);
  const reviews={...state.reviews,[question.skillId]:scheduleReview(state.reviews[question.skillId],question.skillId,rating,at)};
  return {...state,attempts:[...state.attempts,{questionId:question.id,skillId:question.skillId,correct,usedHint,at:at.toISOString()}],reviews,stars:state.stars+(correct?1:0)};
}
export function questionsFor(grade: Grade, subject?: Subject): Question[] { return questions.filter(q=>q.grade===grade && (!subject || q.subject===subject)); }