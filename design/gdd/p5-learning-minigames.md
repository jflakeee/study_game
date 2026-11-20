# P5 Learning Minigames — draft, not approved

Audience: grades 1–3, mobile portrait-first. Existing 72 questions, v1 learning save, village save and reward eligibility remain unchanged.

## Modes
- Number garden: tap counters to represent addition, groups for multiplication, equal sharing for division. Reuse existing question IDs and validated answers.
- Word forest: choose a category member from existing Korean vocabulary questions.
- Sentence bridge: choose causal connective or main idea from existing grade-appropriate questions. Do not imply free sentence ordering until authored content exists.
- Mixed expedition: optional three-question session using existing eligible pool. No timer or forced completion.

## Implementation sequence
P5-02 number garden interaction (tap and keyboard, explicit submit, bounded counters, reset on new question). P5-03 word forest visual mode. P5-04 sentence bridge. P5-05 optional mixed expedition UI. P5-06 educator content review and regression tests.

## Safety and pedagogy
All alternative representations submit through the same tutor and save path. No extra star for mode switching or repeated attempts. Scaffolds that reveal the answer must mark usedHint. No countdowns, prizes, ads, streak penalties, purchases, or forced exploration. Accessible text alternative; avoid color-only meanings, drag-only controls, and excessive animation. No additional personal data.

## Acceptance
Verify correct/wrong/hinted/repeated answers, switching modes, keyboard, 320px viewport, duplicate taps, stale tabs, quota failure, and unchanged learning and village saves. Full CI and real device release gates remain outstanding; public deployment HOLD. Keep main unchanged.
