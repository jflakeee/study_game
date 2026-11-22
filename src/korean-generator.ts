import type {Grade, Question} from './learning.ts';
import {generatedQuestionId, questionAt, type QuestionGenerator} from './question-generator.ts';

// Curated semantic pairs; no arbitrary substitutions that change the correct answer.
const vocabulary = [
  ['사과','과일'],['배','과일'],['포도','과일'],['딸기','과일'],['바나나','과일'],
  ['강아지','동물'],['고양이','동물'],['토끼','동물'],['사자','동물'],['기린','동물'],
  ['연필','학용품'],['지우개','학용품'],['공책','학용품'],['자','학용품'],['색연필','학용품'],
  ['버스','탈것'],['기차','탈것'],['자전거','탈것'],['자동차','탈것'],['비행기','탈것'],
  ['피아노','악기'],['바이올린','악기'],['기타','악기'],['북','악기'],['플루트','악기'],
  ['수박','과일'],['귤','과일'],['복숭아','과일'],
  ['코끼리','동물'],['호랑이','동물'],['펭귄','동물'],
  ['가위','학용품'],['필통','학용품'],['풀','학용품'],
  ['선박','탈것'],['오토바이','탈것'],['헬리콥터','탈것'],
  ['첼로','악기'],['트럼펫','악기'],['하모니카','악기'],
] as const;
const causes = [
  ['비가 와서','우산을 썼다'],['추워서','외투를 입었다'],['배가 고파서','밥을 먹었다'],
  ['목이 말라서','물을 마셨다'],['어두워서','불을 켰다'],['손이 더러워서','손을 씻었다'],
  ['길을 잃어서','길을 물었다'],['피곤해서','잠을 잤다'],['햇빛이 강해서','모자를 썼다'],
  ['연필심이 부러져서','연필을 깎았다'],['비가 그쳐서','우산을 접었다'],['책이 궁금해서','책을 펼쳤다'],
  ['발이 아파서','잠시 쉬었다'],['시험이 끝나서','책을 덮었다'],
  ['날씨가 더워서','선풍기를 켰다'],['친구가 넘어져서','친구를 일으켜 주었다'],
  ['시간이 늦어서','서둘러 집에 갔다'],['신발이 젖어서','마른 신발로 갈아 신었다'],
  ['창문이 열려 있어서','창문을 닫았다'],['화분의 흙이 말라서','화분에 물을 주었다'],
] as const;
const actions = [
  ['꽃에 물을 주었다','꽃 돌보기'],['길에 떨어진 쓰레기를 주웠다','환경 정리'],
  ['도서관에서 책을 읽었다','독서'],['친구와 함께 공을 찼다','운동'],
  ['씨앗을 심고 흙을 덮었다','씨앗 심기'],['종이를 접어 배를 만들었다','종이접기'],
  ['식탁에 접시와 수저를 놓았다','식사 준비'],['강아지에게 밥을 주었다','동물 돌보기'],
  ['화분의 마른 잎을 떼었다','식물 돌보기'],['친구에게 편지를 썼다','편지 쓰기'],
  ['옷을 개어 서랍에 넣었다','옷 정리'],['과일을 씻어 접시에 담았다','간식 준비'],
  ['넘어진 친구의 손을 잡아 일으켜 주었다','친구 돕기'],
  ['아침에 일어나 이를 깨끗하게 닦았다','양치질'],
  ['횡단보도에서 초록불을 기다렸다','교통안전'],
  ['운동장에서 줄넘기를 연습했다','줄넘기'],
  ['물감을 섞어 풍경화를 그렸다','그림 그리기'],
  ['주방에서 채소를 썰어 국을 끓였다','요리'],
  ['비누로 손을 씻고 수건으로 닦았다','손 씻기'],
  ['화단에 핀 꽃을 자세히 관찰했다','꽃 관찰'],
  ['연필을 깎아 필통에 정리했다','학용품 정리'],
  ['우체통에 편지를 넣었다','편지 보내기'],
  ['친구와 함께 노래를 불렀다','노래 부르기'],
  ['종이상자를 모아 분리배출했다','재활용'],
] as const;
const contexts = ['오늘','어제','아침에','오후에','주말에','방과 후에','집에서','학교에서','친구와','가족과'];
const readingContexts = ['오늘','어제','아침에','오후에','주말에','방과 후에','지난주에','며칠 전에','어느 날','쉬는 날'];
const people = ['민지','준호','수아','지훈','유나','도윤','하린','서준','지아','현우'];
// Counts distinct learning concepts, not cosmetic context/name variations.
export const KOREAN_CONCEPT_COUNTS = {1: vocabulary.length, 2: causes.length, 3: actions.length} as const;
const hasFinalConsonant = (word: string): boolean => {
  const code = word.codePointAt(word.length - 1) ?? 0;
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
};
const objectParticle = (word: string): string => hasFinalConsonant(word) ? '을' : '를';
const subjectParticle = (word: string): string => hasFinalConsonant(word) ? '이' : '가';
const topicParticle = (word: string): string => hasFinalConsonant(word) ? '은' : '는';
const distractors = ['운동','독서','요리','그림 그리기','청소','노래 부르기','낚시','등산','수영','춤추기','장보기','게임하기','악기 연주','책 정리','화분 옮기기','달리기'];

export function koreanGenerator(grade: Grade): QuestionGenerator {
  const skillId = grade === 1 ? 'korean.vocabulary.categories' : grade === 2 ? 'korean.sentences.causes' : 'korean.reading.mainidea';
  return {
    grade, subject: 'korean', skillId, count: 1200,
    generate(index: number): Question {
      if (!Number.isSafeInteger(index) || index < 0 || index >= 1200) throw new RangeError('Question index out of range');
      const conceptCount = grade === 1 ? vocabulary.length : grade === 2 ? causes.length : actions.length;
      const variant = index % conceptCount;
      const contextIndex = Math.floor(index / conceptCount) % contexts.length;
      const personIndex = Math.floor(index / (conceptCount * contexts.length)) % people.length;
      const [word, category] = vocabulary[variant];
      const [cause, effect] = causes[variant % causes.length];
      const [action, topic] = actions[variant % actions.length];
      const person = people[personIndex], context = grade === 3 ? readingContexts[contextIndex] : contexts[contextIndex];
      let prompt: string, answer: string, hint: string, explanation: string, wrong: string[];
      if (grade === 1) {
        prompt = `${context} ${person}${subjectParticle(person)} '${word}'${objectParticle(word)} 보았어요. '${word}'${topicParticle(word)} 무엇에 속하나요?`;
        answer = category; wrong = ['과일','동물','학용품','탈것','악기'].filter(x => x !== answer).slice(0, 2);
        hint = '물건이나 생물의 종류를 생각해 보세요.';
        explanation = `${word}${topicParticle(word)} ${category}에 속해요.`;
      } else if (grade === 2) {
        prompt = `${context} ${person}${topicParticle(person)} ${cause} ${effect}. 그렇게 행동한 까닭은 무엇인가요?`;
        answer = cause; wrong = causes.filter(([c]) => c !== answer).slice((variant + 1) % 8, ((variant + 1) % 8) + 2).map(([c]) => c);
        hint = '앞부분에서 이유를 찾아 보세요.';
        explanation = `그렇게 한 까닭은 '${cause}'예요.`;
      } else {
        prompt = `${context} ${person}${topicParticle(person)} ${action}. 이 글의 중심 내용은 무엇인가요?`;
        answer = topic; wrong = distractors.filter(x => x !== answer).slice((variant + 1) % 12, ((variant + 1) % 12) + 2);
        hint = '글에서 가장 중요한 행동을 찾아 보세요.';
        explanation = `이 글은 '${topic}'에 관한 내용이에요.`;
      }
      const choices = [answer, ...wrong];
      const rotation = index % 3;
      return {id: generatedQuestionId(skillId,index), grade, subject:'korean', skillId,
        prompt, choices:[...choices.slice(rotation),...choices.slice(0,rotation)],answer,hint,explanation};
    }
  };
}
export function koreanQuestionAt(grade: Grade, index: number): Question {
  return questionAt(koreanGenerator(grade), index);
}
