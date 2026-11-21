import type {Grade, Subject, Question} from './learning.ts';
import {mathGenerator} from './math-generator.ts';
import {koreanGenerator} from './korean-generator.ts';
import {nextGeneratedQuestion} from './question-generator.ts';

export const PROGRESS_KEY = 'study-game-generated-progress-v1';
export type TrackKey = `${Grade}:${Subject}`;
export interface TrackProgress { position: number; offset: number }
export interface GeneratedProgress { version: 1; tracks: Partial<Record<TrackKey, TrackProgress>> }
export const emptyGeneratedProgress = (): GeneratedProgress => ({version: 1, tracks: {}});

export function trackKey(grade: Grade, subject: Subject): TrackKey {
  return `${grade}:${subject}`;
}
function generatorFor(grade: Grade, subject: Subject) {
  return subject === 'math' ? mathGenerator(grade) : koreanGenerator(grade);
}
function validTrack(track: unknown): track is TrackProgress {
  if (!track || typeof track !== 'object') return false;
  const value = track as Partial<TrackProgress>;
  return Number.isSafeInteger(value.position) && value.position! >= 0 &&
    Number.isSafeInteger(value.offset) && value.offset! >= 0;
}
export function parseGeneratedProgress(raw: string | null): GeneratedProgress | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const progress = value as Partial<GeneratedProgress>;
    if (progress.version !== 1 || !progress.tracks || typeof progress.tracks !== 'object' ||
        Array.isArray(progress.tracks)) return null;
    const allowed = new Set(['1:math','1:korean','2:math','2:korean','3:math','3:korean']);
    if (!Object.entries(progress.tracks).every(([key, track]) => allowed.has(key) && validTrack(track))) return null;
    return progress as GeneratedProgress;
  } catch { return null; }
}
export function loadGeneratedProgress(storage: Pick<Storage,'getItem'>): GeneratedProgress {
  try { return parseGeneratedProgress(storage.getItem(PROGRESS_KEY)) ?? emptyGeneratedProgress(); }
  catch { return emptyGeneratedProgress(); }
}
export function saveGeneratedProgress(storage: Pick<Storage,'setItem'>, progress: GeneratedProgress): boolean {
  try { storage.setItem(PROGRESS_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}
export function currentGeneratedQuestion(progress: GeneratedProgress, grade: Grade, subject: Subject): Question {
  const track = progress.tracks[trackKey(grade, subject)] ?? {position: 0, offset: 0};
  return nextGeneratedQuestion(generatorFor(grade, subject), track.position, track.offset);
}
// Advance only after a submitted answer, never on render or hint.
// The old progress object is never mutated.
export function advanceGeneratedProgress(progress: GeneratedProgress, grade: Grade, subject: Subject): GeneratedProgress {
  const key = trackKey(grade, subject);
  const track = progress.tracks[key] ?? {position: 0, offset: 0};
  const count = generatorFor(grade, subject).count;
  const position = track.position + 1;
  if (!Number.isSafeInteger(position)) throw new RangeError('Progress overflow');
  return {...progress, tracks: {...progress.tracks, [key]: {position, offset: track.offset}}};
}
export function generatedTrackStatus(progress: GeneratedProgress, grade: Grade, subject: Subject) {
  const count = generatorFor(grade, subject).count;
  const position = progress.tracks[trackKey(grade, subject)]?.position ?? 0;
  return {completed: Math.min(position, count), total: count, cycles: Math.floor(position / count)};
}
