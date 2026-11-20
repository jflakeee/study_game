# P5-12 content audit

Source: src/learning.ts at 6a1bea325dba763bfa8abbe70ab88d8ad8e833df. Extracted four question array literals and executed JS data checks (not TypeScript module execution).

72 questions, 72 unique IDs, zero duplicate skill/prompt pairs, zero detected invalid choice/hint/explanation shapes, 36/36 arithmetic answers correct.

| Skill | First | Second | Third |
|---|---:|---:|---:|
| math.add.10 | 3 | 6 | 3 |
| korean.word.1 | 6 | 4 | 2 |
| math.mul.2 | 3 | 6 | 3 |
| korean.sentence.2 | 5 | 4 | 3 |
| math.div.3 | 3 | 6 | 3 |
| korean.reading.3 | 6 | 3 | 3 |
| Total | 26 | 29 | 17 |

Recommendation: balance positions while preserving IDs, answers, and deterministic browser fixtures. No choice order changes in this audit. Educator review, actual learning runtime, CI and device verification remain pending. Public deployment held.
