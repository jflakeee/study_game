# Preliminary system inventory (reverse-engineered, not approved GDD)
2026-11-19 — baseline d5ab2a340fd6b09f07f8378e848229b5c7a58ce9.
CCGS map-systems requires design/gdd/game-concept.md, absent. Formal decomposition blocked; this preliminary inventory preserves code findings pending concept creation. No native skills or agent gates executed.
| ID | System | State | Priority | Depends on |
|---|---|---|---|---|
| S01 | Learning schema | implemented | P0 | — |
| S02 | Question bank (18, six concepts) | basic | P0 | S01 |
| S03 | Persistence | implemented | P0 | S01 |
| S04 | Cross-tab protection | CI failure | P0 | S03 |
| S05 | Grade/question selection | implemented | P0 | S02,S09 |
| S06 | Answer evaluation | implemented | P0 | S01,S02 |
| S07 | Tutor | partial | P0 | S06 |
| S08 | Mastery | partial | P0 | S01,S06 |
| S09 | Review | implemented | P0 | S01,S06 |
| S10 | Stars | implemented | P0 | S06,S03,S04,S07 |
| S11 | Village | basic | P1 | S10 |
| S12 | Mobile UI | partial | P1 | S05,S06,S07,S11 |
| S13 | Accessibility | partial | P1 | S12 |
| S14 | Progress display | basic | P1 | S08,S09,S12 |
| S15 | Response-time review | module only | P1 | S09 |
| S16 | Visual polish | planned | P2 | S12,S11 |
| S17 | Sound | absent | P2 | S12,S10 |
| S18 | QA | partial | P0 | cross-cutting |
Dependencies are design/data contracts, not necessarily import edges. No claimed independent director review. Runtime feedback loop is not a design dependency cycle. QA cross-cutting.
## Findings
- main.ts explanation save branch never resets saving; subsequent answer/grade change blocked. Regression must actually submit next question.
- root-preview-smoke.mjs reader randomly selects question but clicks index 1; correct answer not guaranteed. Seed before navigation and assert known correct choice. Exact CI failure cause not proven.
- main.ts next/hint actions unguarded while write pending; verify delayed-lock scenario.
- mastery level 5 has no promotion path. review-v2 not wired into UI.
- preserve v1 schema, question IDs, no stars on hinted or repeat independent success, existing main and P0-B branch, production HOLD.
Next: reverse-document concept, formal map-systems, then P0 regression fixes. No source modifications or new test execution in this step.
