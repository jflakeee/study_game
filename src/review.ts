import type {Rating,Review} from './learning.ts';
/** Transparent MVP scheduling heuristic, not Anki FSRS. Calendar days are UTC-based. */
export function scheduleReview(previous: Review | undefined, skillId: string, rating: Rating, now: Date): Review {
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid review date');
  const repetitions = rating === 'again' ? 0 : (previous?.repetitions ?? 0) + 1;
  const previousDays = previous?.intervalDays ?? 0;
  const intervalDays = rating === 'again' ? 1 : rating === 'hard' ? Math.max(1, Math.round(previousDays * 1.2) || 1) : rating === 'good' ? (previousDays ? Math.max(previousDays+1,Math.round(previousDays*2.2)) : 1) : (previousDays ? Math.max(previousDays+2,Math.round(previousDays*3)) : 3);
  const dueAt = new Date(now.getTime()+intervalDays*86400000).toISOString();
  return {skillId,repetitions,intervalDays,dueAt,lastRating:rating};
}
export function isDue(review: Review | undefined, now: Date): boolean { return !review || new Date(review.dueAt).getTime() <= now.getTime(); }