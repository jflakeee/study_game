# P6-03 Career Dream Learning — design draft
Status: design only; not implemented, not released. Child-friendly career exploration, not career tracking or aptitude judgment.

## User flow
First visit: welcome -> choose dream character -> set today's achievable learning goal (1/3/5 questions, default 3) -> preview career mission -> Learn. Returning visits: quick review of selected character and goal, option to change/skip; no mandatory repeated onboarding. Any career can be changed without deleting stars, attempts, mastery, review, builder or expedition. Do not infer a child's future ability from performance. Allow "아직 모르겠어요 / 자유 탐험" and non-gendered avatars.

## Eight initial careers
- Doctor: care clinic, healthy habits, patient queue and appointment counts
- Lawyer: fair hearing, evidence sorting, respectful listening and document counts
- Police officer: neighborhood safety, lost-property assistance, safe crossing
- 119 emergency responder: prevention, emergency preparedness, equipment counting, asking adults for help; no dangerous self-rescue simulations
- Scientist: observations, seeds, weather, measurements and testable hypotheses
- President: public service, community decisions, fair voting and cooperation; no partisan politics
- Astronaut: space station supplies, planet observations, route distances
- Teacher: classroom books, sharing, explanations and student collaboration
Every role depicts accessible, everyday child-observable analogies; no medical diagnosis, legal advice, emergency instructions, or frightening scenes.

## Content adaptation
Maintain canonical question ID, skill ID, grade, correct answer, choices, grading, attempt and reward rules. Render a career-specific *presentation layer* with prompt, optional scene, hint and explanation, not a new question or separate reward key. Example canonical 4+3=7: doctor clinic 4 waiting + 3 arrive; lawyer 4 papers +3; police 4 signs +3; responder 4 helmets +3; scientist 4 seeds +3; president 4 suggestions +3; astronaut 4 boxes +3; teacher 4 books +3. For subtraction, comparison, grouping and Korean reading, adapt only if semantic mapping preserves the learning objective and correct answer; otherwise use a verified generic fallback. Keep text age-appropriate and factually plausible. Explicit content QA matrix 8 careers × 3 grades × 6 skills; sample every question, validate no change to answer mapping. Avoid dynamic AI-generated graded problems at runtime; curated templates with deterministic selection and editorial review.

## Village and exploration
Keep one persistent village and same milestones/building slots; career changes reskin names, narrative and decorative layers only. Doctor: care center; lawyer: community fairness hall; police: safety station; responder: fire-safety center; scientist: laboratory garden; president: community meeting hall; astronaut: space base; teacher: library classroom. Career-themed map missions and NPC dialog are non-scoring; unlock thresholds remain existing stars. Switching career never resets, multiplies or duplicates unlocks and rewards.

## Data and privacy
Store career ID and goal in a separately versioned preferences key, with validation and safe defaults; do not modify study-game-state-v1 or study-game-village-v1 schemas. No name, birth date, school, photo, location, or career profiling. Handle storage failures gracefully; default to free explorer if preferences unreadable. Cross-tab changes require non-destructive refresh; avoid background writes on navigation. Goal is motivational, not a grade/reward multiplier; completion celebrates effort without pressure. Provide parent/teacher content review and child-facing explanation that dreams may change.

## UX and acceptance
Mobile onboarding with large icon + accessible text labels, screen reader names, 44px targets, no gender stereotypes. Child can skip, change character, change goal. Navigation Learn/Village/Explore reflects selected theme; grade and stars persist. Test: every career across all grades; 72 canonical questions retain IDs and grading; hints and explanations consistent; wrong/retry and repeated correct earn no extra stars; switching character mid-question preserves answer and attempt, with presentation rerender only; migration from absent/invalid preferences; offline and 320px; accessibility; Web Locks/storage conflict. Release gates: TypeScript, unit, Chromium, device, content educator review, explicit approval. Main and Pages unchanged.
