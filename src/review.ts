import type {Rating,Review} from './learning.ts';
/** Bounded MVP scheduling heuristic, not Anki FSRS. */
export function scheduleReview(previous: Review | undefined, skillId: string, rating: Rating, now: Date): Review {
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid review date');
  const previousDays = Math.min(30, Math.max(1, previous?.intervalDays ?? 1));
  const previousDue = previous ? Date.parse(previous.dueAt) : NaN;
  if (previous && (rating === 'good' || rating === 'easy') && previous.lastRating === rating && previousDue > now.getTime() && previousDue <= now.getTime()+30*86400000 && previous.intervalDays <= 30) return previous;
  const repetitions = rating === 'again' ? 0 : (previous?.repetitions ?? 0) + 1;
  const intervalDays = Math.min(30, rating === 'again' ? 1 : rating === 'hard' ? Math.max(1,Math.floor(previousDays/2)) : rating === 'good' ? (previous ? Math.max(previousDays+1,Math.round(previousDays*2.2)) : 1) : (previous ? Math.max(previousDays+2,Math.round(previousDays*3)) : 3));
  const dueAt = new Date(now.getTime()+intervalDays*86400000).toISOString();
  return {skillId,repetitions,intervalDays,dueAt,lastRating:rating};
}
export function isDue(review: Review | undefined, now: Date): boolean { return !review || new Date(review.dueAt).getTime() <= now.getTime(); }
