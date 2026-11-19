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

export const expansionQuestions: Question[] = [
  {
    "id": "m1-add-4",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "2 + 5 = ?",
    "choices": [
      "7",
      "6",
      "8"
    ],
    "answer": "7",
    "hint": "2부터 다섯 칸 세어요.",
    "explanation": "2+5=7이에요."
  },
  {
    "id": "m1-add-5",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "3 + 6 = ?",
    "choices": [
      "8",
      "10",
      "9"
    ],
    "answer": "9",
    "hint": "3부터 여섯 칸 세어요.",
    "explanation": "3+6=9예요."
  },
  {
    "id": "m1-add-6",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "4 + 4 = ?",
    "choices": [
      "9",
      "8",
      "7"
    ],
    "answer": "8",
    "hint": "4를 두 번 더해요.",
    "explanation": "4+4=8이에요."
  },
  {
    "id": "k1-word-4",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "옷을 골라요.",
    "choices": [
      "바지",
      "연필",
      "사과"
    ],
    "answer": "바지",
    "hint": "몸에 입는 물건이에요.",
    "explanation": "바지는 옷이에요."
  },
  {
    "id": "k1-word-5",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "악기를 골라요.",
    "choices": [
      "책상",
      "우산",
      "피아노"
    ],
    "answer": "피아노",
    "hint": "소리를 내어 음악을 연주해요.",
    "explanation": "피아노는 악기예요."
  },
  {
    "id": "k1-word-6",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "채소를 골라요.",
    "choices": [
      "공책",
      "당근",
      "신발"
    ],
    "answer": "당근",
    "hint": "밭에서 자라는 먹거리예요.",
    "explanation": "당근은 채소예요."
  },
  {
    "id": "m2-mul-4",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "5 × 3 = ?",
    "choices": [
      "15",
      "8",
      "20"
    ],
    "answer": "15",
    "hint": "5를 세 번 더해요.",
    "explanation": "5+5+5=15예요."
  },
  {
    "id": "m2-mul-5",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "6 × 2 = ?",
    "choices": [
      "8",
      "14",
      "12"
    ],
    "answer": "12",
    "hint": "6을 두 번 더해요.",
    "explanation": "6+6=12예요."
  },
  {
    "id": "m2-mul-6",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "4 × 5 = ?",
    "choices": [
      "24",
      "20",
      "9"
    ],
    "answer": "20",
    "hint": "4를 다섯 번 더해요.",
    "explanation": "4+4+4+4+4=20이에요."
  },
  {
    "id": "k2-sentence-4",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "목이 말라서 물을 마셨다. 까닭은?",
    "choices": [
      "목이 말라서",
      "추워서",
      "비가 와서"
    ],
    "answer": "목이 말라서",
    "hint": "물 마시기 전 상태를 찾아요.",
    "explanation": "목이 말랐기 때문이에요."
  },
  {
    "id": "k2-sentence-5",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "버스를 놓쳐서 걸어갔다. 까닭은?",
    "choices": [
      "배가 고파서",
      "졸려서",
      "버스를 놓쳐서"
    ],
    "answer": "버스를 놓쳐서",
    "hint": "문장 앞부분을 읽어요.",
    "explanation": "버스를 놓쳤기 때문이에요."
  },
  {
    "id": "k2-sentence-6",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "날이 어두워져서 불을 켰다. 까닭은?",
    "choices": [
      "더워서",
      "날이 어두워져서",
      "음악이 좋아서"
    ],
    "answer": "날이 어두워져서",
    "hint": "불을 켜기 전 상황을 찾아요.",
    "explanation": "날이 어두워졌기 때문이에요."
  },
  {
    "id": "m3-div-4",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "28 ÷ 7 = ?",
    "choices": [
      "4",
      "3",
      "5"
    ],
    "answer": "4",
    "hint": "7에 무엇을 곱하면 28일까요?",
    "explanation": "7×4=28이에요."
  },
  {
    "id": "m3-div-5",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "36 ÷ 6 = ?",
    "choices": [
      "5",
      "7",
      "6"
    ],
    "answer": "6",
    "hint": "6씩 묶어 보세요.",
    "explanation": "6×6=36이에요."
  },
  {
    "id": "m3-div-6",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "45 ÷ 5 = ?",
    "choices": [
      "10",
      "9",
      "8"
    ],
    "answer": "9",
    "hint": "5에 무엇을 곱하면 45일까요?",
    "explanation": "5×9=45예요."
  },
  {
    "id": "k3-main-4",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "수아는 책을 빌렸다. 집에서 끝까지 읽었다. 중심 내용은?",
    "choices": [
      "책 읽기",
      "요리하기",
      "달리기"
    ],
    "answer": "책 읽기",
    "hint": "수아가 한 활동을 생각해요.",
    "explanation": "책을 빌려 읽은 이야기예요."
  },
  {
    "id": "k3-main-5",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "친구들은 종이를 모았다. 새 종이로 재활용했다. 중심 내용은?",
    "choices": [
      "축구 연습",
      "꽃 심기",
      "종이 재활용"
    ],
    "answer": "종이 재활용",
    "hint": "종이를 모아 무엇을 했나요?",
    "explanation": "종이를 재활용한 이야기예요."
  },
  {
    "id": "k3-main-6",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "준호는 강아지에게 밥을 주었다. 함께 산책했다. 중심 내용은?",
    "choices": [
      "과일 사기",
      "강아지 돌보기",
      "학교 청소"
    ],
    "answer": "강아지 돌보기",
    "hint": "두 행동의 공통 대상을 찾아요.",
    "explanation": "강아지를 돌본 이야기예요."
  }
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
export const extendedQuestions: Question[] = [
  {
    "id": "m1-add-7",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "1 + 5 = ?",
    "choices": [
      "7",
      "6",
      "5"
    ],
    "answer": "6",
    "hint": "1부터 5칸 더 세어요.",
    "explanation": "1 + 5 = 6예요."
  },
  {
    "id": "m1-add-8",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "2 + 4 = ?",
    "choices": [
      "5",
      "7",
      "6"
    ],
    "answer": "6",
    "hint": "2부터 4칸 더 세어요.",
    "explanation": "2 + 4 = 6예요."
  },
  {
    "id": "m1-add-9",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "3 + 4 = ?",
    "choices": [
      "7",
      "6",
      "8"
    ],
    "answer": "7",
    "hint": "3부터 4칸 더 세어요.",
    "explanation": "3 + 4 = 7예요."
  },
  {
    "id": "m1-add-10",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "4 + 4 = ?",
    "choices": [
      "9",
      "8",
      "7"
    ],
    "answer": "8",
    "hint": "4부터 4칸 더 세어요.",
    "explanation": "4 + 4 = 8예요."
  },
  {
    "id": "m1-add-11",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "5 + 5 = ?",
    "choices": [
      "9",
      "11",
      "10"
    ],
    "answer": "10",
    "hint": "5부터 5칸 더 세어요.",
    "explanation": "5 + 5 = 10예요."
  },
  {
    "id": "m1-add-12",
    "grade": 1,
    "subject": "math",
    "skillId": "math.add.10",
    "prompt": "7 + 3 = ?",
    "choices": [
      "10",
      "9",
      "11"
    ],
    "answer": "10",
    "hint": "7부터 3칸 더 세어요.",
    "explanation": "7 + 3 = 10예요."
  },
  {
    "id": "m2-mul-7",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "2 × 6 = ?",
    "choices": [
      "13",
      "12",
      "11"
    ],
    "answer": "12",
    "hint": "2씩 6묶음을 생각해요.",
    "explanation": "2 × 6 = 12예요."
  },
  {
    "id": "m2-mul-8",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "3 × 5 = ?",
    "choices": [
      "14",
      "16",
      "15"
    ],
    "answer": "15",
    "hint": "3씩 5묶음을 생각해요.",
    "explanation": "3 × 5 = 15예요."
  },
  {
    "id": "m2-mul-9",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "4 × 6 = ?",
    "choices": [
      "24",
      "23",
      "25"
    ],
    "answer": "24",
    "hint": "4씩 6묶음을 생각해요.",
    "explanation": "4 × 6 = 24예요."
  },
  {
    "id": "m2-mul-10",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "5 × 5 = ?",
    "choices": [
      "26",
      "25",
      "24"
    ],
    "answer": "25",
    "hint": "5씩 5묶음을 생각해요.",
    "explanation": "5 × 5 = 25예요."
  },
  {
    "id": "m2-mul-11",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "6 × 3 = ?",
    "choices": [
      "17",
      "19",
      "18"
    ],
    "answer": "18",
    "hint": "6씩 3묶음을 생각해요.",
    "explanation": "6 × 3 = 18예요."
  },
  {
    "id": "m2-mul-12",
    "grade": 2,
    "subject": "math",
    "skillId": "math.mul.2",
    "prompt": "7 × 2 = ?",
    "choices": [
      "14",
      "13",
      "15"
    ],
    "answer": "14",
    "hint": "7씩 2묶음을 생각해요.",
    "explanation": "7 × 2 = 14예요."
  },
  {
    "id": "m3-div-7",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "12 ÷ 2 = ?",
    "choices": [
      "7",
      "6",
      "5"
    ],
    "answer": "6",
    "hint": "12개를 2묶음으로 나눠요.",
    "explanation": "12 ÷ 2 = 6예요."
  },
  {
    "id": "m3-div-8",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "21 ÷ 3 = ?",
    "choices": [
      "6",
      "8",
      "7"
    ],
    "answer": "7",
    "hint": "21개를 3묶음으로 나눠요.",
    "explanation": "21 ÷ 3 = 7예요."
  },
  {
    "id": "m3-div-9",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "28 ÷ 4 = ?",
    "choices": [
      "7",
      "6",
      "8"
    ],
    "answer": "7",
    "hint": "28개를 4묶음으로 나눠요.",
    "explanation": "28 ÷ 4 = 7예요."
  },
  {
    "id": "m3-div-10",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "35 ÷ 5 = ?",
    "choices": [
      "8",
      "7",
      "6"
    ],
    "answer": "7",
    "hint": "35개를 5묶음으로 나눠요.",
    "explanation": "35 ÷ 5 = 7예요."
  },
  {
    "id": "m3-div-11",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "42 ÷ 6 = ?",
    "choices": [
      "6",
      "8",
      "7"
    ],
    "answer": "7",
    "hint": "42개를 6묶음으로 나눠요.",
    "explanation": "42 ÷ 6 = 7예요."
  },
  {
    "id": "m3-div-12",
    "grade": 3,
    "subject": "math",
    "skillId": "math.div.3",
    "prompt": "56 ÷ 7 = ?",
    "choices": [
      "8",
      "7",
      "9"
    ],
    "answer": "8",
    "hint": "56개를 7묶음으로 나눠요.",
    "explanation": "56 ÷ 7 = 8예요."
  },
  {
    "id": "k1-word-7",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "채소 이름을 골라요.",
    "choices": [
      "신발",
      "당근",
      "시계"
    ],
    "answer": "당근",
    "hint": "어떤 종류의 낱말인지 생각해요.",
    "explanation": "당근이(가) 알맞은 낱말이에요."
  },
  {
    "id": "k1-word-8",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "악기를 골라요.",
    "choices": [
      "우산",
      "감자",
      "피아노"
    ],
    "answer": "피아노",
    "hint": "어떤 종류의 낱말인지 생각해요.",
    "explanation": "피아노이(가) 알맞은 낱말이에요."
  },
  {
    "id": "k1-word-9",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "몸의 한 부분을 골라요.",
    "choices": [
      "손",
      "책",
      "구름"
    ],
    "answer": "손",
    "hint": "어떤 종류의 낱말인지 생각해요.",
    "explanation": "손이(가) 알맞은 낱말이에요."
  },
  {
    "id": "k1-word-10",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "옷을 골라요.",
    "choices": [
      "기차",
      "바지",
      "사과"
    ],
    "answer": "바지",
    "hint": "어떤 종류의 낱말인지 생각해요.",
    "explanation": "바지이(가) 알맞은 낱말이에요."
  },
  {
    "id": "k1-word-11",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "문구를 골라요.",
    "choices": [
      "고양이",
      "양파",
      "지우개"
    ],
    "answer": "지우개",
    "hint": "어떤 종류의 낱말인지 생각해요.",
    "explanation": "지우개이(가) 알맞은 낱말이에요."
  },
  {
    "id": "k1-word-12",
    "grade": 1,
    "subject": "korean",
    "skillId": "korean.word.1",
    "prompt": "곤충을 골라요.",
    "choices": [
      "나비",
      "참새",
      "물고기"
    ],
    "answer": "나비",
    "hint": "어떤 종류의 낱말인지 생각해요.",
    "explanation": "나비이(가) 알맞은 낱말이에요."
  },
  {
    "id": "k2-sentence-7",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "\"눈이 와서 장갑을 꼈다.\" 장갑을 낀 까닭은?",
    "choices": [
      "해가 져서",
      "눈이 와서",
      "배가 고파서"
    ],
    "answer": "눈이 와서",
    "hint": "문장 앞부분에서 이유를 찾아요.",
    "explanation": "까닭은 '눈이 와서'라는 부분에 나와요."
  },
  {
    "id": "k2-sentence-8",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "\"목이 말라서 물을 마셨다.\" 물을 마신 까닭은?",
    "choices": [
      "추워서",
      "잠이 와서",
      "목이 말라서"
    ],
    "answer": "목이 말라서",
    "hint": "문장 앞부분에서 이유를 찾아요.",
    "explanation": "까닭은 '목이 말라서'라는 부분에 나와요."
  },
  {
    "id": "k2-sentence-9",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "\"어두워서 불을 켰다.\" 불을 켠 까닭은?",
    "choices": [
      "어두워서",
      "더워서",
      "비가 와서"
    ],
    "answer": "어두워서",
    "hint": "문장 앞부분에서 이유를 찾아요.",
    "explanation": "까닭은 '어두워서'라는 부분에 나와요."
  },
  {
    "id": "k2-sentence-10",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "\"손이 더러워서 손을 씻었다.\" 손을 씻은 까닭은?",
    "choices": [
      "책을 읽어서",
      "손이 더러워서",
      "배가 아파서"
    ],
    "answer": "손이 더러워서",
    "hint": "문장 앞부분에서 이유를 찾아요.",
    "explanation": "까닭은 '손이 더러워서'라는 부분에 나와요."
  },
  {
    "id": "k2-sentence-11",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "\"꽃이 예뻐서 사진을 찍었다.\" 사진을 찍은 까닭은?",
    "choices": [
      "밥이 맛있어서",
      "눈이 와서",
      "꽃이 예뻐서"
    ],
    "answer": "꽃이 예뻐서",
    "hint": "문장 앞부분에서 이유를 찾아요.",
    "explanation": "까닭은 '꽃이 예뻐서'라는 부분에 나와요."
  },
  {
    "id": "k2-sentence-12",
    "grade": 2,
    "subject": "korean",
    "skillId": "korean.sentence.2",
    "prompt": "\"버스를 놓쳐서 걸어갔다.\" 걸어간 까닭은?",
    "choices": [
      "버스를 놓쳐서",
      "신발이 커서",
      "물이 차가워서"
    ],
    "answer": "버스를 놓쳐서",
    "hint": "문장 앞부분에서 이유를 찾아요.",
    "explanation": "까닭은 '버스를 놓쳐서'라는 부분에 나와요."
  },
  {
    "id": "k3-main-7",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "\"준이는 책을 빌렸다. 집에서 책을 재미있게 읽었다.\" 중심 내용은?",
    "choices": [
      "수영하기",
      "책 읽기",
      "요리하기"
    ],
    "answer": "책 읽기",
    "hint": "두 문장에서 이어지는 활동을 생각해요.",
    "explanation": "두 문장은 책 읽기에 관한 이야기예요."
  },
  {
    "id": "k3-main-8",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "\"친구들이 힘을 모아 상자를 옮겼다. 함께하니 쉬웠다.\" 중심 내용은?",
    "choices": [
      "혼자 달리기",
      "그림 그리기",
      "협동하기"
    ],
    "answer": "협동하기",
    "hint": "두 문장에서 이어지는 활동을 생각해요.",
    "explanation": "두 문장은 협동하기에 관한 이야기예요."
  },
  {
    "id": "k3-main-9",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "\"수아는 종이를 접었다. 종이배를 완성했다.\" 중심 내용은?",
    "choices": [
      "종이배 만들기",
      "빨래하기",
      "꽃 심기"
    ],
    "answer": "종이배 만들기",
    "hint": "두 문장에서 이어지는 활동을 생각해요.",
    "explanation": "두 문장은 종이배 만들기에 관한 이야기예요."
  },
  {
    "id": "k3-main-10",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "\"우리는 물을 아껴 썼다. 양치할 때 컵을 사용했다.\" 중심 내용은?",
    "choices": [
      "연필 깎기",
      "물 절약하기",
      "간식 먹기"
    ],
    "answer": "물 절약하기",
    "hint": "두 문장에서 이어지는 활동을 생각해요.",
    "explanation": "두 문장은 물 절약하기에 관한 이야기예요."
  },
  {
    "id": "k3-main-11",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "\"현우는 강아지에게 먹이를 주었다. 산책도 시켰다.\" 중심 내용은?",
    "choices": [
      "공부하기",
      "버스 타기",
      "강아지 돌보기"
    ],
    "answer": "강아지 돌보기",
    "hint": "두 문장에서 이어지는 활동을 생각해요.",
    "explanation": "두 문장은 강아지 돌보기에 관한 이야기예요."
  },
  {
    "id": "k3-main-12",
    "grade": 3,
    "subject": "korean",
    "skillId": "korean.reading.3",
    "prompt": "\"가족이 채소를 씻었다. 함께 샐러드를 만들었다.\" 중심 내용은?",
    "choices": [
      "샐러드 만들기",
      "산책하기",
      "편지 쓰기"
    ],
    "answer": "샐러드 만들기",
    "hint": "두 문장에서 이어지는 활동을 생각해요.",
    "explanation": "두 문장은 샐러드 만들기에 관한 이야기예요."
  }
];

export function questionsFor(grade: Grade, subject?: Subject): Question[] { return [...questions,...variantQuestions,...expansionQuestions,...extendedQuestions].filter(q=>q.grade===grade && (!subject || q.subject===subject)); }